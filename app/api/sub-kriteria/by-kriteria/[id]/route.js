import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  const { id } = params

  try {
    const subkriteria = await prisma.subKriteria.findMany({
      where: { kriteriaId: id },
      orderBy: { nama_sub_kriteria: 'asc' },
    })

    return NextResponse.json(subkriteria)
  } catch (err) {
    console.error('Gagal fetch subkriteria:', err)
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 })
  }
}
