import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
  const { periodeId } = params

  try {
    if (!periodeId) {
      return NextResponse.json({ error: 'Periode ID tidak valid' }, { status: 400 })
    }

    const data = await prisma.hasilPerhitungan.findMany({
      where: { periodeId },
      include: {
        calonPenerima: true,
        periode: true,
      },
      orderBy: { rangking: 'asc' },
    })

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data hasil perhitungan untuk periode ini.' },
        { status: 404 }
      )
    }

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12

    page.drawText(`Hasil Perhitungan - Periode: ${data[0].periode.nama_periode}`, {
      x: 50,
      y: height - 50,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    const headers = ['Ranking', 'Nama Calon', 'Nilai Akhir', 'Status']
    const startY = height - 80
    const rowHeight = 20
    const colX = [50, 120, 350, 450]

    headers.forEach((header, i) => {
      page.drawText(header, {
        x: colX[i],
        y: startY,
        size: fontSize,
        font,
      })
    })

    data.forEach((item, rowIndex) => {
      const y = startY - (rowIndex + 1) * rowHeight
      const values = [
        String(item.rangking),
        item.calonPenerima?.nama_lengkap || '-',
        item.nilai_akhir.toFixed(4),
        item.status,
      ]
      values.forEach((text, colIndex) => {
        page.drawText(text, {
          x: colX[colIndex],
          y,
          size: fontSize,
          font,
        })
      })
    })

    const pdfBytes = await pdfDoc.save()

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=hasil-perhitungan-${periodeId}.pdf`,
      },
    })
  } catch (error) {
    console.error('[EXPORT_PDF_ERROR]', error)
    return NextResponse.json({ error: 'Gagal membuat file PDF' }, { status: 500 })
  }
}
