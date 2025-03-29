import prisma from '@/lib/prisma'

export async function GET(_, { params }) {
  try {
    const data = await prisma.calonPenerima.findUnique({
      where: {
        id: params.id,
      },
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
      return Response.json(
        {
          success: false,
          message: 'Data calon penerima tidak ditemukan',
        },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('[GET_CALON_PENERIMA_BY_ID_ERROR]', error)
    return Response.json(
      {
        success: false,
        message: 'Gagal mengambil data calon penerima',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  const data = await request.json()
  const updated = await prisma.calonPenerima.update({ where: { id: params.id }, data })
  return Response.json(updated)
}

export async function DELETE(_, { params }) {
  await prisma.calonPenerima.delete({ where: { id: params.id } })
  return Response.json(null, { status: 204 })
}
