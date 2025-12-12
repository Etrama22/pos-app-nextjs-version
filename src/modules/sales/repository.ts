import prisma from '@/lib/prisma'
import { CreateSaleDTO, SaleQueryDTO } from './dto'
import { Prisma, PaymentMethod } from '@prisma/client'
import { generateReceiptNumber } from '@/lib/utils'

export class SaleRepository {
  async findAll(query: SaleQueryDTO) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      paymentMethod,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query

    const where: Prisma.SaleWhereInput = {
      ...(startDate && {
        createdAt: {
          gte: new Date(startDate),
        },
      }),
      ...(endDate && {
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          lte: new Date(endDate),
        },
      }),
      ...(paymentMethod && { paymentMethod }),
      ...(userId && { userId }),
    }

    const [data, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.sale.count({ where }),
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
    return prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async findByReceiptNumber(receiptNumber: string) {
    return prisma.sale.findUnique({
      where: { receiptNumber },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async create(data: CreateSaleDTO) {
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.priceAtSale * item.quantity,
      0
    )
    const discount = data.discount || 0
    const tax = data.tax || 0
    const total = subtotal - discount + tax
    const changeAmount = data.paymentAmount - total

    return prisma.$transaction(async (tx) => {
      // Create sale
      const sale = await tx.sale.create({
        data: {
          receiptNumber: generateReceiptNumber(),
          subtotal,
          discount,
          tax,
          total,
          paymentMethod: data.paymentMethod,
          paymentAmount: data.paymentAmount,
          changeAmount: changeAmount > 0 ? changeAmount : 0,
          notes: data.notes,
          userId: data.userId,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtSale: item.priceAtSale,
              subtotal: item.priceAtSale * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // Update product stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return sale
    })
  }

  async getSummary(startDate?: string, endDate?: string) {
    const where: Prisma.SaleWhereInput = {
      ...(startDate && {
        createdAt: {
          gte: new Date(startDate),
        },
      }),
      ...(endDate && {
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          lte: new Date(endDate),
        },
      }),
    }

    const [aggregation, paymentMethods] = await Promise.all([
      prisma.sale.aggregate({
        where,
        _count: true,
        _sum: {
          total: true,
          discount: true,
          tax: true,
        },
        _avg: {
          total: true,
        },
      }),
      prisma.sale.groupBy({
        by: ['paymentMethod'],
        where,
        _count: true,
        _sum: {
          total: true,
        },
      }),
    ])

    return {
      totalSales: aggregation._count,
      totalRevenue: aggregation._sum.total || 0,
      totalDiscount: aggregation._sum.discount || 0,
      totalTax: aggregation._sum.tax || 0,
      averageTransaction: aggregation._avg.total || 0,
      paymentMethodBreakdown: paymentMethods.map((pm) => ({
        method: pm.paymentMethod,
        count: pm._count,
        total: pm._sum.total || 0,
      })),
    }
  }

  async getTodaySales() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return prisma.sale.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getRecentSales(limit: number = 5) {
    return prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}

export const saleRepository = new SaleRepository()
