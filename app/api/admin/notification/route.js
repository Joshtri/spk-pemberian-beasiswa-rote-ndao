// /pages/api/admin/notifikasi/index.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'

    const skip = (page - 1) * limit

    const where = {
      judul: {
        contains: search,
        mode: 'insensitive',
      },
    }

    if (filter === 'unread') {
      where.dibaca = false
    }
    if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      where.createdAt = {
        gte: today,
      }
    }

    const [totalItems, data] = await Promise.all([
      prisma.notifikasi.count({ where }),
      prisma.notifikasi.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    const unread = await prisma.notifikasi.count({ where: { dibaca: false } })
    const today = await prisma.notifikasi.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    })

    return NextResponse.json({
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      stats: {
        total: totalItems,
        unread,
        today,
      },
    })
  } catch (error) {
    console.error('[NOTIFIKASI_GET_ERROR]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { judul, isi, role } = body

    if (!judul || !isi) {
      return NextResponse.json({ error: 'Judul dan isi wajib diisi' }, { status: 400 })
    }

    const users = await prisma.user.findMany({
      where: {
        role: role || 'CALON_PENERIMA',
      },
    })

    const notifData = users.map((user) => ({
      userId: user.id,
      judul,
      isi,
    }))

    await prisma.notifikasi.createMany({ data: notifData })

    return NextResponse.json({ message: 'Notifikasi berhasil dikirim' })
  } catch (error) {
    console.error('[NOTIFIKASI_POST_ERROR]', error)
    return NextResponse.json({ error: 'Gagal mengirim notifikasi' }, { status: 500 })
  }
}
