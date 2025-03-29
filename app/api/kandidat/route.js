import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request) {
  try {
    const user = await  getAuthUser(request, ['CALON_PENERIMA']) // bisa diganti 'KANDIDAT' jika enum role kamu pakai itu
    const body = await request.json()

    const created = await prisma.calonPenerima.create({
      data: {
        userId: user.id,
        nama_lengkap: body.nama_lengkap,
        alamat: body.alamat,
        tanggal_lahir: body.tanggal_lahir,
        rt_rw: body.rt_rw,
        kelurahan_desa: body.kelurahan_desa,
        kecamatan: body.kecamatan,
        perguruan_Tinggi: body.perguruan_tinggi,
        fakultas_prodi: body.fakultas_prodi,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error('Gagal create data kandidat:', error)
    return NextResponse.json({ message: 'Gagal menyimpan data kandidat' }, { status: 500 })
  }
}
