import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { uploadFileToFirebase } from '@/lib/uploadToFirebase'
import { deleteFileFromFirebase } from '@/lib/firebase'

export async function PUT(request) {
  try {
    const user = await getAuthUser(request, ['CALON_PENERIMA'])
    const formData = await request.formData()

    // Get penilaian data from form
    const penilaianData = JSON.parse(formData.get('penilaian') || '[]')

    // Validate penilaian data
    if (!Array.isArray(penilaianData)) {
      return NextResponse.json(
        { success: false, message: 'Data penilaian tidak valid' },
        { status: 400 }
      )
    }

    // Get calon penerima
    const calon = await prisma.calonPenerima.findFirst({
      where: { userId: user.id },
    })

    if (!calon) {
      return NextResponse.json(
        { success: false, message: 'Data calon penerima tidak ditemukan' },
        { status: 404 }
      )
    }

    // Validate active period
    const activePeriode = await prisma.periode.findFirst({
      where: { isActived: true },
      include: { JadwalPendaftaran: true },
    })

    if (!activePeriode) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada periode aktif saat ini' },
        { status: 400 }
      )
    }

    // Check deadline
    if (activePeriode.JadwalPendaftaran) {
      const deadline = new Date(activePeriode.JadwalPendaftaran.batas_akhir)
      const now = new Date()

      if (now > deadline) {
        return NextResponse.json(
          {
            success: false,
            message: 'Batas waktu edit penilaian telah berakhir',
          },
          { status: 400 }
        )
      }
    }

    // Upload files first (outside transaction)
    const fileUploads = {}
    const uploadPromises = []

    const uploadFile = async (file, type) => {
      if (!file) return
      try {
        fileUploads[type] = await uploadFileToFirebase(file, type.toLowerCase())
      } catch (error) {
        console.error(`Gagal upload ${type}:`, error)
        throw new Error(`Gagal mengunggah file ${type}`)
      }
    }

    if (formData.has('KHS')) uploadPromises.push(uploadFile(formData.get('KHS'), 'KHS'))
    if (formData.has('KRS')) uploadPromises.push(uploadFile(formData.get('KRS'), 'KRS'))
    if (formData.has('UKT')) uploadPromises.push(uploadFile(formData.get('UKT'), 'UKT'))
    if (formData.has('PRESTASI'))
      uploadPromises.push(uploadFile(formData.get('PRESTASI'), 'PRESTASI'))

    await Promise.all(uploadPromises)

    // Perform database operations in transaction
    const result = await prisma.$transaction(
      async prisma => {
        // 1. Delete existing penilaian
        await prisma.penilaian.deleteMany({
          where: {
            calonPenerimaId: calon.id,
            periodeId: activePeriode.id,
          },
        })

        // 2. Create new penilaian records
        const createdPenilaian = await prisma.penilaian.createMany({
          data: penilaianData.map(item => ({
            calonPenerimaId: calon.id,
            kriteriaId: item.kriteriaId,
            sub_kriteriaId: item.sub_kriteriaId,
            periodeId: activePeriode.id,
          })),
        })

        // 3. Get first penilaian ID for document linking
        const firstPenilaian = await prisma.penilaian.findFirst({
          where: { calonPenerimaId: calon.id },
          orderBy: { createdAt: 'desc' },
          select: { id: true },
        })

        if (!firstPenilaian) {
          throw new Error('Gagal membuat record penilaian')
        }

        // 4. Get existing documents to delete their files
        const existingDocs = await prisma.dokumenPenilaian.findMany({
          where: {
            penilaian: {
              calonPenerimaId: calon.id,
              periodeId: activePeriode.id,
            },
          },
          select: { fileUrl: true },
        })

        // 4. Delete existing documents
        await prisma.dokumenPenilaian.deleteMany({
          where: {
            penilaian: {
              calonPenerimaId: calon.id,
              periodeId: activePeriode.id,
            },
          },
        })

        const deletePromises = existingDocs.map(doc =>
          doc.fileUrl ? deleteFileFromFirebase(doc.fileUrl) : Promise.resolve(true)
        )
        await Promise.all(deletePromises)

        // 5. Create new document records
        const dokumenData = []
        if (fileUploads.KHS)
          dokumenData.push({
            penilaianId: firstPenilaian.id,
            tipe_dokumen: 'KHS',
            fileUrl: fileUploads.KHS,
          })
        if (fileUploads.KRS)
          dokumenData.push({
            penilaianId: firstPenilaian.id,
            tipe_dokumen: 'KRS',
            fileUrl: fileUploads.KRS,
          })
        if (fileUploads.UKT)
          dokumenData.push({
            penilaianId: firstPenilaian.id,
            tipe_dokumen: 'UKT',
            fileUrl: fileUploads.UKT,
          })
        if (fileUploads.PRESTASI)
          dokumenData.push({
            penilaianId: firstPenilaian.id,
            tipe_dokumen: 'PRESTASI',
            fileUrl: fileUploads.PRESTASI,
          })

        if (dokumenData.length > 0) {
          await prisma.dokumenPenilaian.createMany({
            data: dokumenData,
          })
        }

        return {
          penilaianCount: createdPenilaian.count,
          dokumenCount: dokumenData.length,
        }
      },
      {
        maxWait: 20000,
        timeout: 30000,
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Penilaian dan dokumen berhasil diperbarui',
      data: result,
    })
  } catch (error) {
    console.error('[PENILAIAN_UPDATE_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Gagal memperbarui data penilaian',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
