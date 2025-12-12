import { productRepository } from './repository'
import { CreateProductDTO, UpdateProductDTO, ProductQueryDTO } from './dto'

export class ProductService {
  async getProducts(query: ProductQueryDTO) {
    return productRepository.findAll(query)
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new Error('Produk tidak ditemukan')
    }
    return product
  }

  async getProductByBarcode(barcode: string) {
    const product = await productRepository.findByBarcode(barcode)
    if (!product) {
      throw new Error('Produk tidak ditemukan')
    }
    return product
  }

  async getActiveProducts(search?: string) {
    return productRepository.findActiveProducts(search)
  }

  async createProduct(data: CreateProductDTO) {
    // Check if barcode already exists
    if (data.barcode) {
      const existingProduct = await productRepository.findByBarcode(data.barcode)
      if (existingProduct) {
        throw new Error('Barcode sudah digunakan')
      }
    }

    return productRepository.create(data)
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    // Check if product exists
    const existingProduct = await productRepository.findById(id)
    if (!existingProduct) {
      throw new Error('Produk tidak ditemukan')
    }

    // Check if barcode already exists (excluding current product)
    if (data.barcode && data.barcode !== existingProduct.barcode) {
      const productWithBarcode = await productRepository.findByBarcode(data.barcode)
      if (productWithBarcode) {
        throw new Error('Barcode sudah digunakan')
      }
    }

    return productRepository.update(id, data)
  }

  async deleteProduct(id: string) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new Error('Produk tidak ditemukan')
    }

    return productRepository.delete(id)
  }

  async getCategories() {
    return productRepository.getCategories()
  }

  async getLowStockProducts(threshold?: number) {
    return productRepository.getLowStockProducts(threshold)
  }

  async updateStock(id: string, quantity: number) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new Error('Produk tidak ditemukan')
    }

    if (product.stock < quantity) {
      throw new Error('Stok tidak mencukupi')
    }

    return productRepository.updateStock(id, quantity)
  }
}

export const productService = new ProductService()
