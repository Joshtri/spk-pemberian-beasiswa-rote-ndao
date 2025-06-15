import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await getAuthUser(request, ['CALON_PENERIMA'])

    const calon = await prisma.calonPenerima.findFirst({
      where: { userId: user.user?.id },
    })

    if (!calon) {
      return NextResponse.json({ message: 'Data calon penerima tidak ditemukan' }, { status: 404 })
    }

    const penilaian = await prisma.penilaian.findMany({
      where: { calonPenerimaId: calon.id },
      include: {
        kriteria: true,
        subKriteria: true,
        periode: true,
      },
    })

    return NextResponse.json(penilaian)
  } catch (error) {
    console.error('Gagal mengambil penilaian:', error)
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 })
  }
}
