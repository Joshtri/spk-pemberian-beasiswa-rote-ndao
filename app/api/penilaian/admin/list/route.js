import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const periodeId = searchParams.get('periodeId')

    const where = {}
    if (periodeId) {
      where.periodeId = periodeId
    }

    // 1. Ambil semua calonPenerimaId unik dengan filter yang sesuai
    const groupedCalon = await prisma.penilaian.groupBy({
      by: ['calonPenerimaId'],
      where,
    })

    const total = groupedCalon.length
    const totalPages = Math.ceil(total / limit)

    // 2. Ambil calonPenerimaId yang hanya sesuai dengan halaman ini
    const paginatedCalon = groupedCalon
      .slice((page - 1) * limit, page * limit)
      .map(g => g.calonPenerimaId)

    // 3. Ambil semua data penilaian yang berelasi dengan calon tersebut
    const penilaianList = await prisma.penilaian.findMany({
      where: {
        ...where,
        calonPenerimaId: {
          in: paginatedCalon,
        },
      },
      include: {
        calonPenerima: true,
        periode: true,
        subKriteria: {
          include: {
            kriteria: true,
          },
        },
        kriteria: true,
        dokumen: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: penilaianList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('[PENILAIAN_ADMIN_LIST_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
