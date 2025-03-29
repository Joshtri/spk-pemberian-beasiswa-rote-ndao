import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(request) {
  try {
    const user = await getAuthUser(request, ["CALON_PENERIMA"])

    const calon = await prisma.calonPenerima.findFirst({
      where: { userId: user.id },
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
      return NextResponse.json({ message: "Data calon penerima tidak ditemukan" }, { status: 404 })
    }

    // Gabungkan data user dan calon penerima
    const data = {
      ...calon,
      username: calon.user.username,
      email: calon.user.email,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Gagal fetch profil calon penerima:", error)
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser(request, ["CALON_PENERIMA"])
    const data = await request.json()

    // Update calon penerima data
    const updateData = {
      nama_lengkap: data.nama_lengkap,
      alamat: data.alamat,
      tanggal_lahir: data.tanggal_lahir,
      rt_rw: data.rt_rw,
      kelurahan_desa: data.kelurahan_desa,
      kecamatan: data.kecamatan,
      perguruan_Tinggi: data.perguruan_Tinggi,
      fakultas_prodi: data.fakultas_prodi,
    }

    const updatedCalonPenerima = await prisma.calonPenerima.update({
      where: { userId: user.id },
      data: updateData,
    })

    // If password is provided, update user password
    if (data.password) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: data.password, // Note: In a real app, you should hash this password
        },
      })
    }

    return NextResponse.json({
      message: "Data berhasil diperbarui",
      data: updatedCalonPenerima,
    })
  } catch (error) {
    console.error("Gagal update profil calon penerima:", error)
    return NextResponse.json({ message: "Terjadi kesalahan saat memperbarui data" }, { status: 500 })
  }
}

