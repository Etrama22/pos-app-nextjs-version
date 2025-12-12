import { PaymentMethod } from '@prisma/client'

export interface CreateSaleItemDTO {
  productId: string
  quantity: number
  priceAtSale: number
}

export interface CreateSaleDTO {
  items: CreateSaleItemDTO[]
  discount?: number
  tax?: number
  paymentMethod: PaymentMethod
  paymentAmount: number
  notes?: string
  userId?: string
}

export interface SaleQueryDTO {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  paymentMethod?: PaymentMethod
  userId?: string
  sortBy?: 'createdAt' | 'total'
  sortOrder?: 'asc' | 'desc'
}

export interface SaleItemResponseDTO {
  id: string
  quantity: number
  priceAtSale: number
  subtotal: number
  product: {
    id: string
    name: string
    imageUrl: string | null
  }
}

export interface SaleResponseDTO {
  id: string
  receiptNumber: string
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  paymentAmount: number
  changeAmount: number
  notes: string | null
  createdAt: Date
  items: SaleItemResponseDTO[]
  user: {
    id: string
    name: string | null
    email: string
  } | null
}

export interface SaleListResponseDTO {
  data: SaleResponseDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SaleSummaryDTO {
  totalSales: number
  totalRevenue: number
  totalDiscount: number
  totalTax: number
  averageTransaction: number
  paymentMethodBreakdown: {
    method: PaymentMethod
    count: number
    total: number
  }[]
}
