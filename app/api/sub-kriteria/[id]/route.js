import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const data = await prisma.subKriteria.findUnique({ 
      where: { id },
      include: {
        kriteria: true  // Include the parent kriteria
      }
    })
    
    if (!data) {
      return Response.json({ message: 'SubKriteria not found' }, { status: 404 })
    }
    
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching sub kriteria:', error)
    return Response.json({ message: 'Gagal mendapatkan sub kriteria', error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate data
    if (!body.kriteriaId) {
      return Response.json({ message: 'KriteriaId is required' }, { status: 400 })
    }
    
    if (!body.nama_sub_kriteria) {
      return Response.json({ message: 'Nama sub kriteria is required' }, { status: 400 })
    }
    
    if (body.bobot_sub_kriteria === undefined || body.bobot_sub_kriteria === null) {
      return Response.json({ message: 'Bobot sub kriteria is required' }, { status: 400 })
    }

    const updated = await prisma.subKriteria.update({
      where: { id },
      data: {
        nama_sub_kriteria: body.nama_sub_kriteria,
        bobot_sub_kriteria: parseFloat(body.bobot_sub_kriteria),
        kriteriaId: body.kriteriaId,
      },
      include: {
        kriteria: true  // Include the parent kriteria in the response
      }
    })

    return Response.json(updated)
  } catch (error) {
    console.error('Gagal update sub kriteria:', error)
    return Response.json({ 
      message: 'Gagal update', 
      error: error.message 
    }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params
    
    // await prisma.subKriteria.delete({ where: { id } })
    await prisma.subKriteria.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'subkriteria deleted successfully' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}