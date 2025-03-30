import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req) {
  try {
    // Autentikasi user dengan role CALON_PENERIMA
    const user = await getAuthUser(req, ['CALON_PENERIMA'])

    // Ambil notifikasi untuk user ini
    const notifikasi = await prisma.notifikasi.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10, // ambil 10 notifikasi terbaru
    })

    return NextResponse.json({ success: true, data: notifikasi })
  } catch (error) {
    console.error('[NOTIFIKASI_GET_ERROR]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil notifikasi', error: error.message },
      { status: 500 }
    )
  }
}
