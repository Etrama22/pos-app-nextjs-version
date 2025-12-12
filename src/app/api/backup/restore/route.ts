import { NextRequest, NextResponse } from 'next/server'
import { backupService } from '@/modules/backup'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID backup harus diisi' },
        { status: 400 }
      )
    }

    const result = await backupService.restoreBackup(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error restoring backup:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Gagal restore backup' },
      { status: 500 }
    )
  }
}
