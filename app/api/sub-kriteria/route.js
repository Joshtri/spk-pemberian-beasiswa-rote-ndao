import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const list = await prisma.subKriteria.findMany({
    include: {
      kriteria: true, // This ensures we get the parent kriteria data
    },
  })
  return Response.json(list)
}

export async function POST(request) {
  try {
    const body = await request.json()

    // Debug log backend
    console.log('Received body:', body)

    const subKriteria = await prisma.subKriteria.create({
      data: body,
      include: { kriteria: true },
    })

    const kriteria = await prisma.kriteria.findUnique({ where: { id: body.kriteriaId } })
    if (!kriteria) {
      return NextResponse.json({ message: 'Kriteria tidak ditemukan' }, { status: 400 })
    }

    return NextResponse.json(subKriteria, { status: 201 })
  } catch (error) {
    console.error('Error backend:', error)
    return NextResponse.json(
      { message: 'Gagal membuat sub kriteria', error: error.message },
      { status: 500 }
    )
  }
}
