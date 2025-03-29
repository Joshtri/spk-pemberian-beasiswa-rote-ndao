import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const activePeriode = await prisma.periode.findFirst({
      where: {
        isActived: true,
      },
    })

    if (!activePeriode) {
      return NextResponse.json({ success: false, message: "No active period found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: activePeriode })
  } catch (error) {
    console.error("Error fetching active period:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch active period" }, { status: 500 })
  }
}

