import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.backupLog.deleteMany();
  await prisma.setting.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 12);
  const cashierPassword = await bcrypt.hash("kasir123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@pos.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const cashier = await prisma.user.create({
    data: {
      name: "Kasir User",
      email: "kasir@pos.com",
      password: cashierPassword,
      role: "CASHIER",
    },
  });

  console.log("✅ Users created");

  // Create products
  const products = [
    {
      name: "Indomie Goreng",
      description: "Mie instan rasa goreng",
      price: 3500,
      stock: 100,
      category: "Makanan",
      barcode: "8998888800018",
      imageUrl:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
    },
    {
      name: "Aqua 600ml",
      description: "Air mineral dalam kemasan",
      price: 4000,
      stock: 150,
      category: "Minuman",
      barcode: "8993675100018",
      imageUrl:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    },
    {
      name: "Teh Botol Sosro",
      description: "Teh kemasan botol",
      price: 5000,
      stock: 80,
      category: "Minuman",
      barcode: "8992802080019",
      imageUrl:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    },
    {
      name: "Oreo Original",
      description: "Biskuit sandwich cokelat",
      price: 12000,
      stock: 50,
      category: "Snack",
      barcode: "8991388100015",
      imageUrl:
        "https://images.unsplash.com/photo-1606312619070-d48b4a0a674e?w=400",
    },
    {
      name: "Chitato Sapi Panggang",
      description: "Keripik kentang rasa sapi panggang",
      price: 10000,
      stock: 75,
      category: "Snack",
      barcode: "8992775300015",
      imageUrl:
        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400",
    },
    {
      name: "Susu Ultra Milk",
      description: "Susu UHT plain 250ml",
      price: 7000,
      stock: 60,
      category: "Minuman",
      barcode: "8992753100016",
      imageUrl:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
    },
    {
      name: "Roti Tawar Sari Roti",
      description: "Roti tawar putih",
      price: 15000,
      stock: 30,
      category: "Makanan",
      barcode: "8993322100014",
      imageUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    },
    {
      name: "Teh Pucuk Harum",
      description: "Teh kemasan botol rasa melati",
      price: 5500,
      stock: 90,
      category: "Minuman",
      barcode: "8993675200017",
      imageUrl:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    },
    {
      name: "Minyak Goreng Bimoli",
      description: "Minyak goreng 1 liter",
      price: 25000,
      stock: 40,
      category: "Kebutuhan Dapur",
      barcode: "8992745100013",
      imageUrl:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    },
    {
      name: "Telur Ayam 1kg",
      description: "Telur ayam negeri",
      price: 32000,
      stock: 25,
      category: "Kebutuhan Dapur",
      barcode: "8991234500012",
      imageUrl:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
    },
    {
      name: "Gula Pasir Gulaku",
      description: "Gula pasir 1kg",
      price: 18000,
      stock: 35,
      category: "Kebutuhan Dapur",
      barcode: "8992745300011",
    },
    {
      name: "Beras Premium 5kg",
      description: "Beras putih premium",
      price: 75000,
      stock: 20,
      category: "Kebutuhan Dapur",
      barcode: "8993456100010",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Products created");

  // Create settings
  await prisma.setting.createMany({
    data: [
      { key: "tax_rate", value: "0.11" },
      { key: "store_name", value: "POS Store" },
      { key: "store_address", value: "Jl. Contoh No. 123" },
      { key: "store_phone", value: "021-1234567" },
    ],
  });

  console.log("✅ Settings created");
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
