import { NextRequest, NextResponse } from 'next/server'
import { saleService } from '@/modules/sales'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const summary = await saleService.getSummary(startDate, endDate)
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching sales summary:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil ringkasan penjualan' },
      { status: 500 }
    )
  }
}
