import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { handleAuthError } from "@/lib/error"
import prisma from "@/lib/prisma"

export async function GET(request) {
  try {
    const user = await getAuthUser(request, ['CALON_PENERIMA'])

    const calonPenerima = await prisma.calonPenerima.findFirst({
      where: {
        userId: user.user?.id,
      },
    })

    if (!calonPenerima) {
      return NextResponse.json({
        success: false,
        message: "Calon penerima belum melakukan onboarding",
      }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: calonPenerima })
  } catch (error) {
    if (['TOKEN_MISSING', 'FORBIDDEN', 'TOKEN_EXPIRED', 'TOKEN_INVALID'].includes(error.code)) {
      return handleAuthError(error)
    }

    console.error("Error fetching calon penerima:", error)
    return NextResponse.json({
      success: false,
      message: "Gagal mengambil data calon penerima",
    }, { status: 500 })
  }
}
