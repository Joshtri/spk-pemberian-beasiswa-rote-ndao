// File: /app/api/penilaian/form-data/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { handleAuthError } from '@/lib/error'

export async function GET(request) {
  try {
    // ✅ Hanya untuk role CALON_PENERIMA
    const user = await getAuthUser(request, ['CALON_PENERIMA'])

    // ✅ Ambil calon penerima dari user yang login
    const calonPenerima = await prisma.calonPenerima.findFirst({
      where: { userId: user.user?.id },
    })

    if (!calonPenerima) {
      return NextResponse.json(
        {
          success: false,
          message: 'Calon penerima belum mengisi data onboarding',
        },
        { status: 404 }
      )
    }

    // ✅ Ambil periode aktif
    const activePeriode = await prisma.periode.findFirst({
      where: { isActived: true },
    })

    if (!activePeriode) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak ada periode aktif saat ini',
        },
        { status: 404 }
      )
    }

    // ✅ Ambil semua kriteria + subkriteria
    const kriteria = await prisma.kriteria.findMany({
      include: {
        subKriteria: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // ✅ Cek apakah user sudah pernah dinilai di periode ini
    const existingPenilaian = await prisma.penilaian.findMany({
      where: {
        calonPenerimaId: calonPenerima.id,
        periodeId: activePeriode.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        calonPenerima,
        activePeriode,
        kriteria,
        existingPenilaian,
      },
    })
  } catch (err) {
    if (['TOKEN_MISSING', 'FORBIDDEN', 'TOKEN_EXPIRED', 'TOKEN_INVALID'].includes(err.code)) {
      return handleAuthError(err)
    }

    console.error('[PENILAIAN_FORM_DATA_ERROR]', err)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memuat data form penilaian',
      },
      { status: 500 }
    )
  }
}
