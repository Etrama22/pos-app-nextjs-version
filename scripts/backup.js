const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const backupDir = path.join(process.cwd(), "backups");

// Create backup directories if they don't exist
const dirs = ["daily", "weekly", "monthly"].map((type) =>
  path.join(backupDir, type)
);

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function createBackup(type) {
  console.log(`Creating ${type} backup...`);

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `backup_${type}_${timestamp}.json`;
    const typeDir = path.join(backupDir, type.toLowerCase());
    const filePath = path.join(typeDir, fileName);

    // Export all data
    const [products, sales, saleItems, users, settings] = await Promise.all([
      prisma.product.findMany(),
      prisma.sale.findMany({ include: { items: true } }),
      prisma.saleItem.findMany(),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.setting.findMany(),
    ]);

    const backupData = {
      products,
      sales,
      saleItems,
      users,
      settings,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    // Get file size
    const stats = fs.statSync(filePath);

    // Save to database
    await prisma.backupLog.create({
      data: {
        fileName,
        filePath,
        fileSize: stats.size,
        type: type.toUpperCase(),
        status: "SUCCESS",
      },
    });

    console.log(`✅ ${type} backup created: ${fileName}`);
  } catch (error) {
    console.error(`❌ ${type} backup failed:`, error.message);

    await prisma.backupLog.create({
      data: {
        fileName: `backup_${type}_failed`,
        filePath: "",
        type: type.toUpperCase(),
        status: "FAILED",
        error: error.message,
      },
    });
  }
}

// Daily backup at midnight
cron.schedule("0 0 * * *", () => {
  createBackup("DAILY");
});

// Weekly backup every Sunday at 1 AM
cron.schedule("0 1 * * 0", () => {
  createBackup("WEEKLY");
});

// Monthly backup on the 1st at 2 AM
cron.schedule("0 2 1 * *", () => {
  createBackup("MONTHLY");
});

console.log("📅 Backup scheduler started");
console.log("- Daily: Every day at 00:00");
console.log("- Weekly: Every Sunday at 01:00");
console.log("- Monthly: 1st of month at 02:00");

// Handle cleanup on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Export for CLI usage
if (require.main === module) {
  const type = process.argv[2]?.toUpperCase() || "MANUAL";

  if (["DAILY", "WEEKLY", "MONTHLY", "MANUAL"].includes(type)) {
    createBackup(type).then(() => {
      prisma.$disconnect();
      process.exit(0);
    });
  } else {
    console.error(
      "Invalid backup type. Use: DAILY, WEEKLY, MONTHLY, or MANUAL"
    );
    process.exit(1);
  }
}
