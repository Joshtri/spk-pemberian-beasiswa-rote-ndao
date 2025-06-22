import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET hasil perhitungan berdasarkan periode
export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url)
    const periodeId = params.periodeId
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'rangking'
    const order = searchParams.get('order') || 'asc'

    const where = { periodeId }

    const [results, total] = await Promise.all([
      prisma.hasilPerhitungan.findMany({
        where,
        include: {
          periode: true,
          calonPenerima: {
            include: {
              user: true,
              penilaian: {
                where: { periodeId },
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

// DELETE semua hasil perhitungan berdasarkan periode
export async function DELETE(req, { params }) {
  try {
    const periodeId = params.periodeId

    if (!periodeId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Periode ID tidak ditemukan',
        },
        { status: 400 }
      )
    }

    const deleted = await prisma.hasilPerhitungan.deleteMany({
      where: { periodeId },
    })

    return NextResponse.json({
      success: true,
      message: `Berhasil menghapus ${deleted.count} hasil perhitungan untuk periode ini.`,
      deletedCount: deleted.count,
    })
  } catch (error) {
    console.error('[HASIL_PERHITUNGAN_DELETE_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus hasil perhitungan',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
