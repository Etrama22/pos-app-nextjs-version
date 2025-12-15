import type { BackupType, BackupStatus } from "@prisma/client";

export interface CreateBackupDTO {
  type: BackupType;
}

export interface BackupLogDTO {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  type: BackupType;
  status: BackupStatus;
  error: string | null;
  createdAt: Date;
}

export interface BackupQueryDTO {
  page?: number;
  limit?: number;
  type?: BackupType;
  status?: BackupStatus;
  sortBy?: "createdAt" | "fileSize";
  sortOrder?: "asc" | "desc";
}

export interface BackupListResponseDTO {
  data: BackupLogDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BackupScheduleDTO {
  dailyEnabled: boolean;
  dailyTime: string;
  weeklyEnabled: boolean;
  weeklyDay: number;
  weeklyTime: string;
  monthlyEnabled: boolean;
  monthlyDate: number;
  monthlyTime: string;
}
