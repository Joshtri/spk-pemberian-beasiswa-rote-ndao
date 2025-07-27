import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req) {
  try {
    const body = await req.json()
    const { calonPenerimaId, verifikasiStatus, alasan_penolakan } = body

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

    if (verifikasiStatus === 'DITOLAK' && !alasan_penolakan) {
      return NextResponse.json(
        { success: false, message: 'Alasan penolakan wajib diisi untuk status DITOLAK.' },
        { status: 400 }
      )
    }

    // Update status verifikasi dan alasan hanya jika diperlukan
    const updateData = {
      verifikasiStatus,
    }

    if (verifikasiStatus === 'DITOLAK') {
      updateData.alasan_penolakan = alasan_penolakan
    }

    // Update penilaian
    const updated = await prisma.penilaian.updateMany({
      where: { calonPenerimaId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: `Berhasil mengubah verifikasi status untuk ${updated.count} penilaian.`,
      data: {
        calonPenerimaId,
        verifikasiStatus,
        alasan_penolakan: verifikasiStatus === 'DITOLAK' ? alasan_penolakan : undefined,
      },
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
