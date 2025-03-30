import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(req, { params }) {
  try {
    const user = await getAuthUser(req, ['CALON_PENERIMA'])
    const { id } = params

    const updated = await prisma.notifikasi.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        dibaca: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Notifikasi ditandai sebagai dibaca',
      data: updated,
    })
  } catch (error) {
    console.error('[READ_NOTIFIKASI_ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal update status dibaca' },
      { status: 500 }
    )
  }
}
