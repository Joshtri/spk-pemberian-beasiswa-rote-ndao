import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const periodeId = searchParams.get('periodeId')

    if (!periodeId) {
      return NextResponse.json({ error: 'periodeId is required' }, { status: 400 })
    }

    // Get periode detail
    const periode = await prisma.periode.findUnique({
      where: { id: periodeId },
      select: { id: true, nama_periode: true },
    })

    if (!periode) {
      return NextResponse.json({ error: 'Periode tidak ditemukan' }, { status: 404 })
    }

    // Get all kriteria
    const kriteria = await prisma.kriteria.findMany({
      select: {
        id: true,
        nama_kriteria: true,
        bobot_kriteria: true,
        tipe_kriteria: true,
      },
    })

    // Get penilaian data (verifikasi DITERIMA)
    const penilaian = await prisma.penilaian.findMany({
      where: {
        periodeId,
        verifikasiStatus: 'DITERIMA',
      },
      select: {
        periodeId: true,
        calonPenerimaId: true,
        calonPenerima: {
          select: {
            nama_lengkap: true,
          },
        },
        kriteriaId: true,
        kriteria: {
          select: {
            tipe_kriteria: true,
          },
        },
        subKriteria: {
          select: {
            bobot_sub_kriteria: true,
          },
        },
      },
    })

    const mappedPenilaian = penilaian.map((item) => ({
      periodeId: item.periodeId,
      calonPenerimaId: item.calonPenerimaId,
      nama_lengkap: item.calonPenerima.nama_lengkap,
      kriteriaId: item.kriteriaId,
      tipe_kriteria: item.kriteria.tipe_kriteria,
      bobot_sub_kriteria: item.subKriteria.bobot_sub_kriteria,
    }))

    return NextResponse.json({
      periode,
      kriteria,
      penilaian: mappedPenilaian,
    })
  } catch (error) {
    console.error('[ADMIN_PERHITUNGAN_ALL_DATA_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
