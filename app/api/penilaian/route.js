import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { uploadFileToFirebase } from '@/lib/uploadToFirebase'

export async function POST(request) {
  try {
    const user = await getAuthUser(request, ['CALON_PENERIMA'])
    const formData = await request.formData()

    // Validate and parse input data
    const penilaianData = JSON.parse(formData.get('penilaian') || '[]')
    if (!Array.isArray(penilaianData)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data penilaian harus berupa array',
        },
        { status: 400 }
      )
    }

    // Find calon penerima
    const calon = await prisma.calonPenerima.findFirst({
      where: { userId: user.id },
    })

    if (!calon) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data calon penerima tidak ditemukan',
        },
        { status: 404 }
      )
    }

    // 1. FIRST UPLOAD ALL FILES (OUTSIDE TRANSACTION)
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

    // 2. THEN PERFORM DATABASE OPERATIONS IN TRANSACTION
    const result = await prisma.$transaction(
      async prisma => {
        // Create all penilaian records
        const createdPenilaian = await prisma.penilaian.createMany({
          data: penilaianData.map(item => ({
            calonPenerimaId: calon.id,
            kriteriaId: item.kriteriaId,
            sub_kriteriaId: item.sub_kriteriaId,
            periodeId: item.periodeId,
          })),
        })

        // Get first penilaian ID for document linking
        const firstPenilaian = await prisma.penilaian.findFirst({
          where: { calonPenerimaId: calon.id },
          orderBy: { createdAt: 'desc' },
          select: { id: true },
        })

        if (!firstPenilaian) {
          throw new Error('Gagal membuat record penilaian')
        }

        // Create document records
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
        // Extended transaction timeout
        maxWait: 10000, // Maximum wait for the transaction to start
        timeout: 15000, // Maximum time for the transaction to complete
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Data berhasil disimpan',
      data: result,
    })
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
