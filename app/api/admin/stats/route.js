import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  try {
    // Cek apakah user sudah login dan punya role ADMIN
    const user = await getAuthUser(request, ['ADMIN'])

    // Hitung total data
    const totalAlternatif = await prisma.calonPenerima.count()
    const totalPeriode = await prisma.periode.count()
    const totalKriteria = await prisma.kriteria.count()

    // Bisa ditambahkan logika tambahan jika ingin membedakan
    const alternatifTerdaftar = totalAlternatif // contoh disamakan

    return NextResponse.json({
      success: true,
      data: {
        totalAlternatif,
        totalPeriode,
        totalKriteria,
        alternatifTerdaftar,
      },
    })
  } catch (error) {
    console.error('[ADMIN_STATS_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil statistik',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
