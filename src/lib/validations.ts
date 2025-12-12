import { z } from 'zod'

// Product Schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk harus diisi'),
  description: z.string().optional(),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  barcode: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

// Sale Schemas
export const saleItemSchema = z.object({
  productId: z.string().min(1, 'Product ID harus diisi'),
  quantity: z.number().int().min(1, 'Quantity minimal 1'),
  priceAtSale: z.number().min(0, 'Harga tidak boleh negatif'),
})

export const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'Minimal 1 item'),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'QRIS', 'TRANSFER']),
  paymentAmount: z.number().min(0, 'Jumlah pembayaran harus diisi'),
  notes: z.string().optional(),
})

export type CreateSaleInput = z.infer<typeof createSaleSchema>
export type SaleItemInput = z.infer<typeof saleItemSchema>

// User Schemas
export const createUserSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['ADMIN', 'CASHIER']).default('CASHIER'),
})

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>

// Backup Schemas
export const createBackupSchema = z.object({
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'MANUAL']),
})

export type CreateBackupInput = z.infer<typeof createBackupSchema>

// Query Schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type DateRangeInput = z.infer<typeof dateRangeSchema>
