import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request) {
  try {
    const user = await getAuthUser(request, ['CALON_PENERIMA']) // bisa diganti 'KANDIDAT' jika enum role kamu pakai itu
    const body = await request.json()

    // console.log('User ID:', user);

    const {
      nama_lengkap,
      alamat,
      tanggal_lahir,
      rt_rw,
      kelurahan_desa,
      kecamatan,
      perguruan_tinggi,
      fakultas_prodi,
      noRekening,
  } = body

    const created = await prisma.calonPenerima.create({
      data: {
        userId: user.user.id,
        nama_lengkap,
        alamat,
        tanggal_lahir,
        rt_rw,
        kelurahan_desa,
        kecamatan,
        perguruan_Tinggi: perguruan_tinggi,
        fakultas_prodi,
        noRekening,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error('Gagal create data kandidat:', error)
    return NextResponse.json({ message: 'Gagal menyimpan data kandidat' }, { status: 500 })
  }
}
