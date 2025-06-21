import prisma from '@/lib/prisma'

export async function GET() {
  const list = await prisma.periode.findMany({
    include: {
      JadwalPendaftaran: true,
    },
  })
  return Response.json(list)
}

export async function POST(request) {
  const data = await request.json()

  const created = await prisma.periode.create({
    data: {
      ...data,
      tanggal_mulai: new Date(data.tanggal_mulai),
      tanggal_selesai: new Date(data.tanggal_selesai),
      kuota_kelulusan: parseInt(data.kuota_kelulusan, 10) || 0,
    },
  })

  return Response.json(created, { status: 201 })
}
