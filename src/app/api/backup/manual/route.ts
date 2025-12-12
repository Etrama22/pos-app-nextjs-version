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

    const backup = await backupService.createBackup('MANUAL')
    return NextResponse.json(backup, { status: 201 })
  } catch (error) {
    console.error('Error creating manual backup:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Gagal membuat backup' },
      { status: 500 }
    )
  }
}
