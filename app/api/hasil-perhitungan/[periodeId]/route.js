import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url)
    const periodeId = params.periodeId
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'rangking'
    const order = searchParams.get('order') || 'asc'

    const where = {
      periodeId,
    }

    const [results, total] = await Promise.all([
      prisma.hasilPerhitungan.findMany({
        where,
        include: {
          periode: true,
          calonPenerima: {
            include: {
              user: true,
              penilaian: {
                where: {
                  periodeId,
                },
                include: {
                  kriteria: true,
                  subKriteria: true,
                  dokumen: true,
                  periode: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sort]: order,
        },
      }),
      prisma.hasilPerhitungan.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error('[HASIL_PERHITUNGAN_GET_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil hasil perhitungan',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
