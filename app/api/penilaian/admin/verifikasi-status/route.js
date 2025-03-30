import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req) {
  try {
    const body = await req.json()
    const { calonPenerimaId, verifikasiStatus } = body

    if (!calonPenerimaId || !verifikasiStatus) {
      return NextResponse.json(
        { success: false, message: 'calonPenerimaId dan verifikasiStatus wajib diisi.' },
        { status: 400 }
      )
    }

    const allowedStatuses = ['PENDING', 'DITERIMA', 'DITOLAK']
    if (!allowedStatuses.includes(verifikasiStatus)) {
      return NextResponse.json(
        { success: false, message: 'Status verifikasi tidak valid.' },
        { status: 400 }
      )
    }

    // Update semua penilaian berdasarkan calonPenerimaId
    const updated = await prisma.penilaian.updateMany({
      where: {
        calonPenerimaId,
      },
      data: {
        verifikasiStatus,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Berhasil mengubah verifikasi status untuk ${updated.count} penilaian.`,
    })
  } catch (error) {
    console.error('[VERIFIKASI_STATUS_UPDATE_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengubah status.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
