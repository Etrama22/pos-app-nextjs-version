import { saleRepository } from './repository'
import { productRepository } from '@/modules/products/repository'
import { CreateSaleDTO, SaleQueryDTO } from './dto'

export class SaleService {
  async getSales(query: SaleQueryDTO) {
    return saleRepository.findAll(query)
  }

  async getSaleById(id: string) {
    const sale = await saleRepository.findById(id)
    if (!sale) {
      throw new Error('Transaksi tidak ditemukan')
    }
    return sale
  }

  async getSaleByReceiptNumber(receiptNumber: string) {
    const sale = await saleRepository.findByReceiptNumber(receiptNumber)
    if (!sale) {
      throw new Error('Transaksi tidak ditemukan')
    }
    return sale
  }

  async createSale(data: CreateSaleDTO) {
    // Validate items
    for (const item of data.items) {
      const product = await productRepository.findById(item.productId)
      if (!product) {
        throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`)
      }
      if (!product.isActive) {
        throw new Error(`Produk ${product.name} tidak aktif`)
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stok ${product.name} tidak mencukupi`)
      }
    }

    // Calculate totals
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.priceAtSale * item.quantity,
      0
    )
    const discount = data.discount || 0
    const tax = data.tax || 0
    const total = subtotal - discount + tax

    // Validate payment
    if (data.paymentAmount < total) {
      throw new Error('Jumlah pembayaran kurang dari total')
    }

    return saleRepository.create(data)
  }

  async getSummary(startDate?: string, endDate?: string) {
    return saleRepository.getSummary(startDate, endDate)
  }

  async getTodaySales() {
    return saleRepository.getTodaySales()
  }

  async getRecentSales(limit?: number) {
    return saleRepository.getRecentSales(limit)
  }

  async getDailySummary(date: Date = new Date()) {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    return saleRepository.getSummary(
      startDate.toISOString(),
      endDate.toISOString()
    )
  }
}

export const saleService = new SaleService()
