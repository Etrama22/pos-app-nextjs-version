import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/modules/products'

export async function GET() {
  try {
    const categories = await productService.getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil kategori' },
      { status: 500 }
    )
  }
}
