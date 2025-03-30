import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await getAuthUser(request, ['CALON_PENERIMA'])

    const calonPenerima = await prisma.calonPenerima.findFirst({
      where: { userId: user.id },
      include: {
        user: true,
        penilaian: {
          include: {
            kriteria: true,
            subKriteria: true,
            periode: true,
          },
        },
        hasilPerhitungan: {
          include: { periode: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!calonPenerima) {
      return NextResponse.json(
        { success: false, message: 'Data calon penerima tidak ditemukan' },
        { status: 404 }
      )
    }

    // === 🔹 Kelengkapan profil ===
    const profilFields = [
      calonPenerima.nama_lengkap,
      calonPenerima.alamat,
      calonPenerima.perguruan_Tinggi,
      calonPenerima.fakultas_prodi,
    ]
    const filledProfil = profilFields.filter(Boolean).length
    const profileCompletion = Math.round((filledProfil / profilFields.length) * 100)

    // === 🔹 Status Kriteria ===
    const allKriteria = await prisma.kriteria.findMany()
    const kriteriaStatus = allKriteria.map(kriteria => {
      const penilaian = calonPenerima.penilaian.find(p => p.kriteriaId === kriteria.id)
      return {
        name: kriteria.nama_kriteria,
        status: penilaian ? 'completed' : 'not_started',
      }
    })

    // === 🔹 Kelengkapan Penilaian ===
    const penilaianCompletion =
      allKriteria.length > 0
        ? Math.round((calonPenerima.penilaian.length / allKriteria.length) * 100)
        : 0

    // === 🔹 Hasil Perhitungan ===
    const hasilPerhitunganTerbaru = calonPenerima.hasilPerhitungan[0]
    let pengumuman = []
    let applicationStatus = 'pending'

    if (hasilPerhitunganTerbaru?.ditampilkanKeUser === true) {
      applicationStatus = hasilPerhitunganTerbaru.status.toLowerCase()
      pengumuman = [
        {
          id: hasilPerhitunganTerbaru.id,
          title: `Hasil Seleksi Periode ${hasilPerhitunganTerbaru.periode?.nama_periode || ''}`,
          content: `Anda berada di peringkat ${hasilPerhitunganTerbaru.rangking} dengan nilai akhir ${hasilPerhitunganTerbaru.nilai_akhir}`,
          date: hasilPerhitunganTerbaru.createdAt.toISOString(),
          status: hasilPerhitunganTerbaru.status,
        },
      ]
    }

    // === 🔹 Periode Aktif ===
    const activePeriode = await prisma.periode.findFirst({
      where: { isActived: true },
      include: { JadwalPendaftaran: true },
    })

    let hasActivePenilaian = false
    if (activePeriode) {
      const penilaianCount = await prisma.penilaian.count({
        where: {
          calonPenerimaId: calonPenerima.id,
          periodeId: activePeriode.id,
        },
      })
      hasActivePenilaian = penilaianCount > 0
    }

    // === ✅ Return Final JSON ===
    return NextResponse.json({
      success: true,
      data: {
        profileInfo: {
          namaLengkap: calonPenerima.nama_lengkap,
          alamat: calonPenerima.alamat,
          perguruanTinggi: calonPenerima.perguruan_Tinggi,
          fakultasProdi: calonPenerima.fakultas_prodi,
        },
        profileCompletion, // 🔥 ini progress profil (bukan penilaian)
        penilaianCompletion, // 🔥 ini progress kriteria yang dinilai
        kriteriaStatus,
        applicationStatus,
        announcements: pengumuman,
        activePeriod: activePeriode
          ? {
              id: activePeriode.id,
              nama_periode: activePeriode.nama_periode,
              jadwalPendaftaran: activePeriode.JadwalPendaftaran,
              hasPenilaian: hasActivePenilaian,
            }
          : null,
        hasilPerhitungan:
          hasilPerhitunganTerbaru?.ditampilkanKeUser === true
            ? {
                rangking: hasilPerhitunganTerbaru.rangking,
                nilaiAkhir: hasilPerhitunganTerbaru.nilai_akhir,
                status: hasilPerhitunganTerbaru.status,
              }
            : null,
      },
    })
  } catch (error) {
    console.error('[DASHBOARD_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memuat data dashboard',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
