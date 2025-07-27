import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { uploadFileToFirebase } from '@/lib/uploadToFirebase'
import { deleteFileFromFirebase } from '@/lib/firebase'

export async function PATCH(request) {
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
      where: { userId: user.user?.id },
      include: {
        penilaian: {
          where: { periode: { isActived: true } },
          include: { dokumen: true },
        },
      },
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

    // Get existing documents
    const existingDocuments = calon.penilaian[0]?.dokumen || []
    const existingDocsMap = {}
    existingDocuments.forEach(doc => {
      existingDocsMap[doc.tipe_dokumen] = doc.fileUrl
    })

    // Prepare file uploads
    const fileUploads = {}
    const uploadPromises = []

    // Function to handle file upload
    const handleFileUpload = async (file, type) => {
      if (!file || file.size === 0) {
        // If no new file uploaded, keep the existing one
        if (existingDocsMap[type]) {
          fileUploads[type] = existingDocsMap[type]
        }
        return
      }

      try {
        // Upload new file
        fileUploads[type] = await uploadFileToFirebase(file, type.toLowerCase())

        // Delete old file if exists
        if (existingDocsMap[type]) {
          await deleteFileFromFirebase(existingDocsMap[type])
        }
      } catch (error) {
        console.error(`Gagal upload ${type}:`, error)
        throw new Error(`Gagal mengunggah file ${type}`)
      }
    }

    // Process each document type
    if (formData.has('KHS')) uploadPromises.push(handleFileUpload(formData.get('KHS'), 'KHS'))
    if (formData.has('KRS')) uploadPromises.push(handleFileUpload(formData.get('KRS'), 'KRS'))
    if (formData.has('SPP')) uploadPromises.push(handleFileUpload(formData.get('SPP'), 'SPP'))
    if (formData.has('PRESTASI'))
      uploadPromises.push(handleFileUpload(formData.get('PRESTASI'), 'PRESTASI'))
    if (formData.has('ORGANISASI'))
      uploadPromises.push(handleFileUpload(formData.get('ORGANISASI'), 'ORGANISASI'))

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

        // 4. Delete all existing document records (we'll recreate them)
        await prisma.dokumenPenilaian.deleteMany({
          where: {
            penilaianId: firstPenilaian.id,
          },
        })

        // 5. Create new document records for all document types
        const dokumenData = [
          { tipe_dokumen: 'KHS', fileUrl: fileUploads.KHS || existingDocsMap.KHS },
          { tipe_dokumen: 'KRS', fileUrl: fileUploads.KRS || existingDocsMap.KRS },
          { tipe_dokumen: 'SPP', fileUrl: fileUploads.SPP || existingDocsMap.SPP },
          { tipe_dokumen: 'PRESTASI', fileUrl: fileUploads.PRESTASI || existingDocsMap.PRESTASI },
          {
            tipe_dokumen: 'ORGANISASI',
            fileUrl: fileUploads.ORGANISASI || existingDocsMap.ORGANISASI,
          },
        ].filter(doc => doc.fileUrl) // Only include documents that have a file

        if (dokumenData.length > 0) {
          await prisma.dokumenPenilaian.createMany({
            data: dokumenData.map(doc => ({
              penilaianId: firstPenilaian.id,
              tipe_dokumen: doc.tipe_dokumen,
              fileUrl: doc.fileUrl,
            })),
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
