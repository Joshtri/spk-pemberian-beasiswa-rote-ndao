import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { handleAuthError } from '@/lib/error'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    // Only for CALON_PENERIMA role
    const user = await getAuthUser(request, ['CALON_PENERIMA'])

    const { documentType } = params
    const { searchParams } = new URL(request.url)
    const periodeId = searchParams.get('periode')

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

    console.log('Document request:', { documentType, periodeId, calonPenerimaId: calonPenerima.id })

    // If periodeId is specified, get documents from that specific period
    if (periodeId) {
      // Find all penilaian from this user for this period
      const penilaianIds = await prisma.penilaian.findMany({
        where: {
          calonPenerimaId: calonPenerima.id,
          periodeId: periodeId,
        },
        select: { id: true },
      })

      if (penilaianIds.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Tidak ada penilaian ditemukan untuk periode ini`,
          },
          { status: 404 }
        )
      }

      // Find the document in those assessments
      const dokumen = await prisma.dokumenPenilaian.findFirst({
        where: {
          tipe_dokumen: documentType,
          penilaianId: {
            in: penilaianIds.map(p => p.id),
          },
        },
        include: {
          penilaian: {
            include: {
              periode: true,
            },
          },
        },
      })

      if (!dokumen) {
        return NextResponse.json(
          {
            success: false,
            message: `Dokumen ${documentType} tidak ditemukan untuk periode ini`,
          },
          { status: 404 }
        )
      }

      // In a real application, you would fetch the file from storage and return blob
      // For now, we'll redirect to the file URL or return file info
      return NextResponse.json({
        success: true,
        data: {
          fileUrl: dokumen.fileUrl,
          fileName: `${documentType.toLowerCase()}_${periodeId}.pdf`,
          periode: dokumen.penilaian.periode.nama_periode,
        },
      })
    } else {
      // If no period specified, get from current active period
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

      // Find all penilaian from this user for active period
      const penilaianIds = await prisma.penilaian.findMany({
        where: {
          calonPenerimaId: calonPenerima.id,
          periodeId: activePeriode.id,
        },
        select: { id: true },
      })

      if (penilaianIds.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Tidak ada penilaian ditemukan untuk periode aktif`,
          },
          { status: 404 }
        )
      }

      // Find the document
      const dokumen = await prisma.dokumenPenilaian.findFirst({
        where: {
          tipe_dokumen: documentType,
          penilaianId: {
            in: penilaianIds.map(p => p.id),
          },
        },
        include: {
          penilaian: {
            include: {
              periode: true,
            },
          },
        },
      })

      if (!dokumen) {
        return NextResponse.json(
          {
            success: false,
            message: `Dokumen ${documentType} tidak ditemukan`,
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          fileUrl: dokumen.fileUrl,
          fileName: `${documentType.toLowerCase()}.pdf`,
          periode: dokumen.penilaian.periode.nama_periode,
        },
      })
    }
  } catch (err) {
    console.error('Detailed error in document API:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      documentType,
      periodeId,
    })

    if (['TOKEN_MISSING', 'FORBIDDEN', 'TOKEN_EXPIRED', 'TOKEN_INVALID'].includes(err.code)) {
      return handleAuthError(err)
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengunduh dokumen',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    )
  }
}
