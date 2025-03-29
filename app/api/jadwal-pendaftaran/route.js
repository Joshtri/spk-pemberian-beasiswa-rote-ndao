import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/jadwal-pendaftaran - Get all jadwal
export async function GET() {
  try {
    const jadwals = await prisma.jadwalPendaftaran.findMany({
      include: {
        periode: {
          select: {
            nama_periode: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(jadwals)
  } catch (error) {
    console.error('Error fetching jadwal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jadwal pendaftaran' },
      { status: 500 }
    )
  }
}

// POST /api/jadwal-pendaftaran - Create new jadwal
export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.periodeId || !body.pembukaan || !body.batas_akhir || 
        !body.seleksi_mulai || !body.seleksi_selesai || !body.pengumuman_penerima) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Check if periode already has jadwal
    const existingJadwal = await prisma.jadwalPendaftaran.findUnique({
      where: { periodeId: body.periodeId }
    })

    if (existingJadwal) {
      return NextResponse.json(
        { error: 'Periode ini sudah memiliki jadwal pendaftaran' },
        { status: 409 }
      )
    }

    // Create jadwal
    const jadwal = await prisma.jadwalPendaftaran.create({
      data: {
        periodeId: body.periodeId,
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

    return NextResponse.json(jadwal, { status: 201 })
  } catch (error) {
    console.error('Error creating jadwal:', error)
    return NextResponse.json(
      { error: 'Failed to create jadwal pendaftaran' },
      { status: 500 }
    )
  }
}