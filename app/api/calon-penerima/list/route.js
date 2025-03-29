import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  try {
    // Hanya izinkan role ADMIN untuk mengakses
    const user = await getAuthUser(request, ['ADMIN'])

    // Ambil semua data calon penerima beserta data user-nya
    const data = await prisma.calonPenerima.findMany({
      select: {
        id: true,
        nama_lengkap: true,
        alamat: true,
        tanggal_lahir: true,
        rt_rw: true,
        kelurahan_desa: true,
        kecamatan: true,
        perguruan_Tinggi: true,  // Changed from perguruan_tinggi to perguruan_Tinggi
        fakultas_prodi: true,
        createdAt: true,
        updatedAt: true,
        // Add other fields if needed
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('[CALON_PENERIMA_LIST_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data calon penerima',
        error: error.message,
      },
      { status: 500 }
    )
  }
}