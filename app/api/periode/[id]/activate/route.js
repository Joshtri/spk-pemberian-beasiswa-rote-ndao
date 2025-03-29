import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { handleAuthError } from '@/lib/error'

export async function PUT(request, { params }) {
  const { id } = await params

  try {
    const user = getAuthUser(request, ['ADMIN'])

    // Cek apakah sudah ada periode yang aktif
    const existingActive = await prisma.periode.findFirst({
      where: {
        isActived: true,
      },
    })

    // Kalau sudah ada periode aktif dan ID-nya bukan yang ini → tolak
    if (existingActive && existingActive.id !== id) {
      return NextResponse.json(
        {
          error: 'PERIODE_ALREADY_ACTIVE',
          message: `Periode "${existingActive.nama_periode}" sudah aktif. Nonaktifkan dulu sebelum mengaktifkan yang lain.`,
        },
        { status: 400 }
      )
    }

    // Set periode ini jadi aktif
    const updated = await prisma.periode.update({
      where: { id },
      data: { isActived: true },
    })

    return NextResponse.json({ message: 'Periode berhasil diaktifkan', data: updated })
  } catch (error) {
    if (['TOKEN_MISSING', 'FORBIDDEN', 'TOKEN_EXPIRED', 'TOKEN_INVALID'].includes(error.code)) {
      return handleAuthError(error)
    }

    console.error('[PERIODE_ACTIVATE_ERROR]', error)
    return NextResponse.json({ error: 'Gagal mengaktifkan periode' }, { status: 500 })
  }
}
