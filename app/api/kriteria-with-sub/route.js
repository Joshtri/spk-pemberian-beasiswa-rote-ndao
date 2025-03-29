import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req) {
  try {
    const user = await getAuthUser(req, ['CALON_PENERIMA'])

    const kriteria = await prisma.kriteria.findMany({
      include: {
        subKriteria: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: kriteria,
    })
  } catch (err) {
    console.error('[GET Kriteria with SubKriteria]', err)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data kriteria',
      },
      { status: 500 }
    )
  }
}
