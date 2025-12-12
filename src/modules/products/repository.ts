import prisma from '@/lib/prisma'
import { CreateProductDTO, UpdateProductDTO, ProductQueryDTO } from './dto'
import { Prisma } from '@prisma/client'

export class ProductRepository {
  async findAll(query: ProductQueryDTO) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { barcode: { contains: search } },
        ],
      }),
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
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
    return prisma.product.findUnique({
      where: { id },
    })
  }

  async findByBarcode(barcode: string) {
    return prisma.product.findUnique({
      where: { barcode },
    })
  }

  async findActiveProducts(search?: string) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0 },
        ...(search && {
          OR: [
            { name: { contains: search } },
            { barcode: { contains: search } },
          ],
        }),
      },
      orderBy: { name: 'asc' },
    })
  }

  async create(data: CreateProductDTO) {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        category: data.category,
        barcode: data.barcode,
        isActive: data.isActive ?? true,
      },
    })
  }

  async update(id: string, data: UpdateProductDTO) {
    return prisma.product.update({
      where: { id },
      data,
    })
  }

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    })
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    })
  }

  async getCategories() {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { category: { not: null } },
    })
    return products.map((p) => p.category).filter(Boolean) as string[]
  }

  async getLowStockProducts(threshold: number = 10) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: threshold },
      },
      orderBy: { stock: 'asc' },
    })
  }
}

export const productRepository = new ProductRepository()
