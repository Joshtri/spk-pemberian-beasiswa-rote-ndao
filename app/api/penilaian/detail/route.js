import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { handleAuthError } from '@/lib/error'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    // Only for CALON_PENERIMA role
    const user = await getAuthUser(request, ['CALON_PENERIMA'])

    // Get calon penerima from logged in user
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

    // Get active period
    const activePeriode = await prisma.periode.findFirst({
      where: { isActived: true },
      include: {
        JadwalPendaftaran: true,
      },
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

    // Get all criteria with sub-criteria
    const kriteria = await prisma.kriteria.findMany({
      include: {
        subKriteria: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Get all sub-criteria (flat list)
    const subKriteria = await prisma.subKriteria.findMany({
      orderBy: { createdAt: 'asc' },
    })

    // Get user's assessments for this period
    const penilaian = await prisma.penilaian.findMany({
      where: {
        calonPenerimaId: calonPenerima.id,
        periodeId: activePeriode.id,
      },
      orderBy: { createdAt: 'asc' },
    })

    // Get all documents related to these assessments
    const documents = {}
    if (penilaian.length > 0) {
      const dokumenRecords = await prisma.dokumenPenilaian.findMany({
        where: {
          penilaianId: {
            in: penilaian.map(p => p.id),
          },
        },
      })

      // Organize documents by type
      dokumenRecords.forEach(doc => {
        documents[doc.tipe_dokumen] = doc.fileUrl
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        calonPenerima,
        activePeriode,
        kriteria,
        subKriteria,
        penilaian,
        documents,
      },
    })
  } catch (err) {
    if (['TOKEN_MISSING', 'FORBIDDEN', 'TOKEN_EXPIRED', 'TOKEN_INVALID'].includes(err.code)) {
      return handleAuthError(err)
    }

    console.error('[PENILAIAN_DETAIL_ERROR]', err)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memuat data detail penilaian',
      },
      { status: 500 }
    )
  }
}
