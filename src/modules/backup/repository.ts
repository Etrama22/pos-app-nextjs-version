import prisma from '@/lib/prisma'
import { BackupType, BackupStatus, Prisma } from '@prisma/client'
import { BackupQueryDTO } from './dto'

export class BackupRepository {
  async findAll(query: BackupQueryDTO) {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query

    const where: Prisma.BackupLogWhereInput = {
      ...(type && { type }),
      ...(status && { status }),
    }

    const [data, total] = await Promise.all([
      prisma.backupLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.backupLog.count({ where }),
    ])

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findById(id: string) {
    return prisma.backupLog.findUnique({
      where: { id },
    })
  }

  async findByFileName(fileName: string) {
    return prisma.backupLog.findFirst({
      where: { fileName },
    })
  }

  async create(data: {
    fileName: string
    filePath: string
    fileSize?: number
    type: BackupType
    status?: BackupStatus
    error?: string
  }) {
    return prisma.backupLog.create({
      data: {
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        type: data.type,
        status: data.status || 'SUCCESS',
        error: data.error,
      },
    })
  }

  async updateStatus(id: string, status: BackupStatus, error?: string) {
    return prisma.backupLog.update({
      where: { id },
      data: { status, error },
    })
  }

  async delete(id: string) {
    return prisma.backupLog.delete({
      where: { id },
    })
  }

  async getLatestByType(type: BackupType) {
    return prisma.backupLog.findFirst({
      where: { type, status: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
    })
  }

  async deleteOldBackups(type: BackupType, retentionDays: number) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    return prisma.backupLog.deleteMany({
      where: {
        type,
        createdAt: { lt: cutoffDate },
      },
    })
  }
}

export const backupRepository = new BackupRepository()
