export interface CreateProductDTO {
  name: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  category?: string
  barcode?: string
  isActive?: boolean
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
  stock?: number
  imageUrl?: string
  category?: string
  barcode?: string
  isActive?: boolean
}

export interface ProductQueryDTO {
  page?: number
  limit?: number
  search?: string
  category?: string
  isActive?: boolean
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductResponseDTO {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  imageUrl: string | null
  category: string | null
  barcode: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductListResponseDTO {
  data: ProductResponseDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
