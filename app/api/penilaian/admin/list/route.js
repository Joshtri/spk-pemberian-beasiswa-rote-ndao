import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic' // To prevent static behavior

export async function GET(request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const periodeId = searchParams.get('periodeId')
    const calonPenerimaId = searchParams.get('calonPenerimaId')
    const kriteriaId = searchParams.get('kriteriaId')

    // Build where clause
    const where = {}

    if (periodeId) {
      where.periodeId = periodeId
    }

    if (calonPenerimaId) {
      where.calonPenerimaId = calonPenerimaId
    }

    if (kriteriaId) {
      where.kriteriaId = kriteriaId
    }

    // Fetch data with relations
    const penilaianList = await prisma.penilaian.findMany({
      where,
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
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get total count for pagination
    const total = await prisma.penilaian.count({ where })

    return NextResponse.json({
      success: true,
      data: penilaianList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
