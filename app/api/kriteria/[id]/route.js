import prisma from '@/lib/prisma'

// GET /api/kriteria/[id]
export async function GET(request, context) {
  const { id } = await context.params

  const data = await prisma.kriteria.findUnique({ where: { id } })

  if (!data) {
    return Response.json({ message: 'Kriteria not found' }, { status: 404 })
  }

  return Response.json(data)
}

// PUT /api/kriteria/[id]
export async function PUT(request, context) {
  const { id } = await context.params
  const body = await request.json()

  try {
    const updated = await prisma.kriteria.update({
      where: { id },
      data: body,
    })
    return Response.json(updated)
  } catch (error) {
    return Response.json({ message: 'Gagal update kriteria' }, { status: 400 })
  }
}

// DELETE /api/kriteria/[id]
export async function DELETE(request, context) {
  const { id } = await context.params

  try {
    const existing = await prisma.kriteria.findUnique({
      where: { id },
    })

    if (!existing) {
      return Response.json({ message: 'Kriteria tidak ditemukan' }, { status: 404 })
    }

    await prisma.kriteria.delete({
      where: { id },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Gagal hapus kriteria:', error)
    return Response.json({ message: 'Gagal menghapus kriteria' }, { status: 500 })
  }
}
