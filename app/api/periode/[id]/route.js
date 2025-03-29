import prisma from '@/lib/prisma'

export async function GET(_, context) {
  const { id } = context.params

  try {
    const data = await prisma.periode.findUnique({
      where: { id },
    })

    if (!data) {
      return Response.json({ message: 'Periode not found' }, { status: 404 })
    }

    return Response.json(data)
  } catch (error) {
    console.error('Gagal fetch periode:', error)
    return Response.json({ message: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function PUT(request, context) {
  const { id } = context.params
  const body = await request.json()

  try {
    const updatePayload = {}

    if (body.nama_periode !== undefined) {
      updatePayload.nama_periode = body.nama_periode
    }

    if (body.tanggal_mulai) {
      const mulai = new Date(body.tanggal_mulai)
      if (isNaN(mulai)) throw new Error('Tanggal mulai tidak valid')
      updatePayload.tanggal_mulai = mulai
    }

    if (body.tanggal_selesai) {
      const selesai = new Date(body.tanggal_selesai)
      if (isNaN(selesai)) throw new Error('Tanggal selesai tidak valid')
      updatePayload.tanggal_selesai = selesai
    }

    if (body.isActived !== undefined) {
      updatePayload.isActived = body.isActived
    }

    const updated = await prisma.periode.update({
      where: { id },
      data: updatePayload,
    })

    return Response.json(updated)
  } catch (error) {
    console.error('Gagal update periode:', error)
    return Response.json({ message: error.message || 'Gagal update periode' }, { status: 400 })
  }
}

export async function DELETE(_, context) {
  const { id } = context.params

  try {
    await prisma.periode.delete({
      where: { id },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Gagal hapus periode:', error)
    return Response.json({ message: 'Gagal hapus periode' }, { status: 400 })
  }
}
