import { NextRequest, NextResponse } from 'next/server'
import { saleService } from '@/modules/sales'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const sale = await saleService.getSaleById(id)
    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error fetching sale:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Gagal mengambil data penjualan' },
      { status: 500 }
    )
  }
}
