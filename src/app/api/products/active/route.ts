import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/modules/products'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined

    const products = await productService.getActiveProducts(search)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching active products:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    )
  }
}
