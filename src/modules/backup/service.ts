import { backupRepository } from "./repository";
import { BackupQueryDTO, CreateBackupDTO } from "./dto";
import type { BackupType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { generateBackupFileName } from "@/lib/utils";
import { config } from "@/lib/config";
import * as fs from "fs";
import * as path from "path";

export class BackupService {
  private backupDir = path.join(process.cwd(), "backups");

  async getBackups(query: BackupQueryDTO) {
    return backupRepository.findAll(query);
  }

  async getBackupById(id: string) {
    const backup = await backupRepository.findById(id);
    if (!backup) {
      throw new Error("Backup tidak ditemukan");
    }
    return backup;
  }

  async createBackup(type: BackupType) {
    const fileName = generateBackupFileName(type.toLowerCase());
    const typeDir = path.join(this.backupDir, type.toLowerCase());
    const filePath = path.join(typeDir, fileName);

    // Create directory if not exists
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    try {
      // Export all data
      const [products, sales, saleItems, users, settings] = await Promise.all([
        prisma.product.findMany(),
        prisma.sale.findMany({
          include: { items: true },
        }),
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
      const backupLog = await backupRepository.create({
        fileName,
        filePath,
        fileSize: stats.size,
        type,
        status: "SUCCESS",
      });

      return backupLog;
    } catch (error) {
      // Log failed backup
      const backupLog = await backupRepository.create({
        fileName,
        filePath,
        type,
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }

  async downloadBackup(id: string) {
    const backup = await backupRepository.findById(id);
    if (!backup) {
      throw new Error("Backup tidak ditemukan");
    }

    if (!fs.existsSync(backup.filePath)) {
      throw new Error("File backup tidak ditemukan");
    }

    const content = fs.readFileSync(backup.filePath, "utf-8");
    return {
      fileName: backup.fileName,
      content,
    };
  }

  async deleteBackup(id: string) {
    const backup = await backupRepository.findById(id);
    if (!backup) {
      throw new Error("Backup tidak ditemukan");
    }

    // Delete file if exists
    if (fs.existsSync(backup.filePath)) {
      fs.unlinkSync(backup.filePath);
    }

    return backupRepository.delete(id);
  }

  async restoreBackup(id: string) {
    const backup = await backupRepository.findById(id);
    if (!backup) {
      throw new Error("Backup tidak ditemukan");
    }

    if (!fs.existsSync(backup.filePath)) {
      throw new Error("File backup tidak ditemukan");
    }

    const content = fs.readFileSync(backup.filePath, "utf-8");
    const data = JSON.parse(content);

    // Restore data in transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing data
      await tx.saleItem.deleteMany();
      await tx.sale.deleteMany();
      await tx.product.deleteMany();
      await tx.setting.deleteMany();

      // Restore products
      if (data.products?.length > 0) {
        for (const product of data.products) {
          await tx.product.create({
            data: {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
              imageUrl: product.imageUrl,
              category: product.category,
              barcode: product.barcode,
              isActive: product.isActive,
              createdAt: new Date(product.createdAt),
              updatedAt: new Date(product.updatedAt),
            },
          });
        }
      }

      // Restore sales
      if (data.sales?.length > 0) {
        for (const sale of data.sales) {
          await tx.sale.create({
            data: {
              id: sale.id,
              receiptNumber: sale.receiptNumber,
              subtotal: sale.subtotal,
              discount: sale.discount,
              tax: sale.tax,
              total: sale.total,
              paymentMethod: sale.paymentMethod,
              paymentAmount: sale.paymentAmount,
              changeAmount: sale.changeAmount,
              notes: sale.notes,
              userId: sale.userId,
              createdAt: new Date(sale.createdAt),
              updatedAt: new Date(sale.updatedAt),
            },
          });
        }
      }

      // Restore sale items
      if (data.saleItems?.length > 0) {
        for (const item of data.saleItems) {
          await tx.saleItem.create({
            data: {
              id: item.id,
              saleId: item.saleId,
              productId: item.productId,
              quantity: item.quantity,
              priceAtSale: item.priceAtSale,
              subtotal: item.subtotal,
              createdAt: new Date(item.createdAt),
            },
          });
        }
      }

      // Restore settings
      if (data.settings?.length > 0) {
        for (const setting of data.settings) {
          await tx.setting.create({
            data: {
              id: setting.id,
              key: setting.key,
              value: setting.value,
              createdAt: new Date(setting.createdAt),
              updatedAt: new Date(setting.updatedAt),
            },
          });
        }
      }
    });

    return { message: "Restore berhasil" };
  }

  async cleanupOldBackups() {
    const { retentionDays } = config.backup;

    await Promise.all([
      backupRepository.deleteOldBackups("DAILY", retentionDays.daily),
      backupRepository.deleteOldBackups("WEEKLY", retentionDays.weekly),
      backupRepository.deleteOldBackups("MONTHLY", retentionDays.monthly),
    ]);
  }

  async getLatestBackups() {
    const [daily, weekly, monthly] = await Promise.all([
      backupRepository.getLatestByType("DAILY"),
      backupRepository.getLatestByType("WEEKLY"),
      backupRepository.getLatestByType("MONTHLY"),
    ]);

    return { daily, weekly, monthly };
  }
}

export const backupService = new BackupService();
