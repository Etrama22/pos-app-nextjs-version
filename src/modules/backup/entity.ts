import type { BackupLog, BackupType, BackupStatus } from "@prisma/client";

export interface BackupLogEntity extends BackupLog {}

export interface BackupData {
  products: unknown[];
  sales: unknown[];
  saleItems: unknown[];
  users: unknown[];
  settings: unknown[];
  exportedAt: string;
  version: string;
}
