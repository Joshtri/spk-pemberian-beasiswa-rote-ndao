import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function PATCH(request) {
  try {
    const user = await getAuthUser(request, ["ADMIN"])

    const { periodeId, tampilkan } = await request.json()

    if (!periodeId || typeof tampilkan !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Periode ID dan status tampilkan wajib diisi" },
        { status: 400 },
      )
    }

    const update = await prisma.hasilPerhitungan.updateMany({
      where: { periodeId },
      data: { ditampilkanKeUser: tampilkan },
    })

    return NextResponse.json({
      success: true,
      message: `Berhasil memperbarui ${update.count} hasil perhitungan.`,
    })
  } catch (error) {
    console.error("[TOGGLE_TAMPILKAN_ERROR]", error)
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui status tampilkan", error: error.message },
      { status: 500 },
    )
  }
}

