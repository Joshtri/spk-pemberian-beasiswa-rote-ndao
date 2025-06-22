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
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12
    const rowHeight = 20
    const marginTop = 50
    const marginBottom = 50
    const colX = [50, 120, 350, 450]

    let page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    let y = height - marginTop

    // Draw header
    page.drawText(`Hasil Perhitungan - Periode: ${data[0].periode.nama_periode}`, {
      x: 50,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    y -= rowHeight + 10

    const headers = ['Ranking', 'Nama Calon', 'Nilai Akhir', 'Status']
    headers.forEach((header, i) => {
      page.drawText(header, {
        x: colX[i],
        y,
        size: fontSize,
        font,
      })
    })

    y -= rowHeight

    for (const item of data) {
      if (y < marginBottom) {
        // Buat halaman baru
        page = pdfDoc.addPage()
        y = height - marginTop

        // Redraw header on new page
        headers.forEach((header, i) => {
          page.drawText(header, {
            x: colX[i],
            y,
            size: fontSize,
            font,
          })
        })

        y -= rowHeight
      }

      const values = [
        String(item.rangking),
        item.calonPenerima?.nama_lengkap || '-',
        Number(item.nilai_akhir).toFixed(4),
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

      y -= rowHeight
    }

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
