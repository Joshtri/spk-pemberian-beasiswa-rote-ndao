import prisma from '@/lib/prisma'
import { getAuthUser, getAuthenticatedUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const user = await getAuthUser(request, ['CALON_PENERIMA'])

    const calon = await prisma.calonPenerima.findFirst({
      where: { userId: user.user.id },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    })

    if (!calon) {
      return NextResponse.json({ message: 'Data calon penerima tidak ditemukan' }, { status: 404 })
    }

    // Gabungkan data user dan calon penerima
    const data = {
      ...calon,
      username: calon.user.username,
      email: calon.user.email,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Gagal fetch profil calon penerima:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan saat mengambil data' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    // Ambil user dari token
    const user = await getAuthenticatedUser(request)
    if (!user || !user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Ambil data dari body (tanpa userId)
    const data = await request.json()

    // Cari calon penerima berdasar user.id dari token
    const calon = await prisma.calonPenerima.findFirst({
      where: { userId: user.id },
    })

    if (!calon) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 })
    }

    // Data untuk update, userId tidak perlu
    const updateData = {
      nama_lengkap: data.nama_lengkap,
      alamat: data.alamat,
      tanggal_lahir: data.tanggal_lahir,
      rt_rw: data.rt_rw,
      kelurahan_desa: data.kelurahan_desa,
      kecamatan: data.kecamatan,
      perguruan_Tinggi: data.perguruan_Tinggi,
      fakultas_prodi: data.fakultas_prodi,

      noRekening: data.noRekening,
      buktiRekening: data.buktiRekening,
    }

    // Update data calon penerima
    const updated = await prisma.calonPenerima.update({
      where: { id: calon.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Gagal update data:', error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Terjadi kesalahan saat update',
      },
      { status: 500 }
    )
  }
}
