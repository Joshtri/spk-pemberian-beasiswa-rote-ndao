import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(req, { params }) {
  const { id } = params

  try {
    if (!id) {
      return NextResponse.json({ error: 'ID notifikasi tidak ditemukan' }, { status: 400 })
    }

    await prisma.notifikasi.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Notifikasi berhasil dihapus' })
  } catch (error) {
    console.error('[NOTIFIKASI_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Gagal menghapus notifikasi' }, { status: 500 })
  }
}
