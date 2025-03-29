import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/jadwal-pendaftaran/[id] - Get single jadwal
export async function GET(request, { params }) {
  try {
    const jadwal = await prisma.jadwalPendaftaran.findUnique({
      where: { id: params.id },
      include: {
        periode: {
          select: {
            id: true,
            nama_periode: true
          }
        }
      }
    })

    if (!jadwal) {
      return NextResponse.json(
        { error: 'Jadwal tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(jadwal)
  } catch (error) {
    console.error('Error fetching jadwal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jadwal' },
      { status: 500 }
    )
  }
}

// PUT /api/jadwal-pendaftaran/[id] - Update jadwal
export async function PUT(request, { params }) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.pembukaan || !body.batas_akhir || 
        !body.seleksi_mulai || !body.seleksi_selesai || !body.pengumuman_penerima) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Check if jadwal exists
    const existingJadwal = await prisma.jadwalPendaftaran.findUnique({
      where: { id: params.id }
    })

    if (!existingJadwal) {
      return NextResponse.json(
        { error: 'Jadwal tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update jadwal
    const updatedJadwal = await prisma.jadwalPendaftaran.update({
      where: { id: params.id },
      data: {
        pembukaan: new Date(body.pembukaan),
        batas_akhir: new Date(body.batas_akhir),
        seleksi_mulai: new Date(body.seleksi_mulai),
        seleksi_selesai: new Date(body.seleksi_selesai),
        pengumuman_penerima: new Date(body.pengumuman_penerima)
      },
      include: {
        periode: {
          select: {
            nama_periode: true
          }
        }
      }
    })

    return NextResponse.json(updatedJadwal)
  } catch (error) {
    console.error('Error updating jadwal:', error)
    return NextResponse.json(
      { error: 'Failed to update jadwal' },
      { status: 500 }
    )
  }
}

// DELETE /api/jadwal-pendaftaran/[id] - Delete jadwal
export async function DELETE(request, { params }) {
  try {
    // Check if jadwal exists
    const existingJadwal = await prisma.jadwalPendaftaran.findUnique({
      where: { id: params.id }
    })

    if (!existingJadwal) {
      return NextResponse.json(
        { error: 'Jadwal tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete jadwal
    await prisma.jadwalPendaftaran.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting jadwal:', error)
    return NextResponse.json(
      { error: 'Failed to delete jadwal' },
      { status: 500 }
    )
  }
}