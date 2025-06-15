import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/calon-penerima/[id]
export async function GET(req, context) {
  try {
    const { id } = context.params

    const data = await prisma.calonPenerima.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    })

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data calon penerima tidak ditemukan',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('[GET_CALON_PENERIMA_BY_ID_ERROR]', error)
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

// PUT /api/calon-penerima/[id]
export async function PUT(req, context) {
  try {
    const { id } = context.params
    const body = await req.json()

    const updated = await prisma.calonPenerima.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('[UPDATE_CALON_PENERIMA_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengupdate data',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/calon-penerima/[id]
export async function DELETE(req, context) {
  try {
    const { id } = context.params

    await prisma.calonPenerima.delete({ where: { id } })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE_CALON_PENERIMA_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus data',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
