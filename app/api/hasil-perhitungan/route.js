import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { results } = body

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ success: false, message: 'Data hasil perhitungan tidak valid.' }, { status: 400 })
    }

    const createdResults = await prisma.hasilPerhitungan.createMany({
      data: results.map(item => ({
        calonPenerimaId: item.calonPenerimaId,
        periodeId: item.periodeId,
        nilai_akhir: item.nilai_akhir,
        rangking: item.rangking,
        status: item.status,
      })),
    })

    return NextResponse.json({ success: true, data: createdResults })
  } catch (error) {
    console.error('[HASIL_PERHITUNGAN_CREATE_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menyimpan hasil perhitungan.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
