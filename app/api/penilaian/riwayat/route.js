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

    console.log('Calon penerima found:', calonPenerima.id)

    // Get current active period
    const currentActivePeriode = await prisma.periode.findFirst({
      where: { isActived: true },
    })

    console.log('Current active period:', currentActivePeriode?.id)

    // Get all assessments for this user
    const allAssessments = await prisma.penilaian.findMany({
      where: {
        calonPenerimaId: calonPenerima.id,
        // Exclude current active period assessments
        ...(currentActivePeriode && {
          periodeId: {
            not: currentActivePeriode.id,
          },
        }),
      },
      include: {
        periode: true,
        kriteria: true,
        subKriteria: true,
        dokumen: true, // Changed from dokumenPenilaian to dokumen
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('All assessments found:', allAssessments.length)

    // If no historical assessments found, return empty array
    if (allAssessments.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    // Group assessments by period
    const assessmentsByPeriod = {}
    allAssessments.forEach(assessment => {
      const periodeId = assessment.periodeId
      if (!assessmentsByPeriod[periodeId]) {
        assessmentsByPeriod[periodeId] = {
          periode: assessment.periode,
          penilaian: [],
          documents: [],
        }
      }
      assessmentsByPeriod[periodeId].penilaian.push(assessment)
      if (assessment.dokumen) {
        // Changed from dokumenPenilaian to dokumen
        assessmentsByPeriod[periodeId].documents.push(...assessment.dokumen)
      }
    })

    // Get hasil perhitungan for each period
    const riwayatData = []
    for (const periodeId in assessmentsByPeriod) {
      const periodData = assessmentsByPeriod[periodeId]

      // Get hasil perhitungan for this period
      const hasilPerhitungan = await prisma.hasilPerhitungan.findFirst({
        where: {
          calonPenerimaId: calonPenerima.id,
          periodeId: periodeId,
        },
      })

      // Get earliest assessment date
      const tanggalDaftar =
        periodData.penilaian.length > 0
          ? periodData.penilaian.reduce((earliest, current) => {
              return new Date(current.createdAt) < new Date(earliest.createdAt) ? current : earliest
            }).createdAt
          : null

      riwayatData.push({
        periode: {
          id: periodData.periode.id,
          nama_periode: periodData.periode.nama_periode,
          tanggal_mulai: periodData.periode.tanggal_mulai,
          tanggal_selesai: periodData.periode.tanggal_selesai,
        },
        penilaian: periodData.penilaian.map(p => ({
          id: p.id,
          kriteria: p.kriteria || {},
          subKriteria: p.subKriteria || {},
          createdAt: p.createdAt,
        })),
        dokumen: periodData.documents,
        hasil: hasilPerhitungan
          ? {
              id: hasilPerhitungan.id,
              total_score: hasilPerhitungan.nilai_akhir, // Changed from total_score to nilai_akhir
              ranking: hasilPerhitungan.rangking, // Changed from ranking to rangking
              status: hasilPerhitungan.status,
              keterangan: hasilPerhitungan.keterangan || null,
            }
          : null,
        tanggal_daftar: tanggalDaftar,
      })
    }

    // Sort by period start date (newest first)
    riwayatData.sort(
      (a, b) => new Date(b.periode.tanggal_mulai) - new Date(a.periode.tanggal_mulai)
    )

    console.log('Final riwayat data length:', riwayatData.length)

    return NextResponse.json({
      success: true,
      data: riwayatData,
    })
  } catch (err) {
    console.error('Detailed error in riwayat API:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
    })

    if (['TOKEN_MISSING', 'FORBIDDEN', 'TOKEN_EXPIRED', 'TOKEN_INVALID'].includes(err.code)) {
      return handleAuthError(err)
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat memuat data riwayat',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    )
  }
}
