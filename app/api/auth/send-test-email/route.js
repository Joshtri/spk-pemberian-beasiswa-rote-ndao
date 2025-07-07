import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST() {
  try {
    console.log('=== TESTING SIMPLE EMAIL SEND ===')

    // Simple configuration that usually works for Indonesian hosting
    const transporter = nodemailer.createTransport({
      host: 'mail.rumahclick314.com',
      port: 465,
      secure: true,
      auth: {
        user: 'laporkkbupatikupang@rumahclick314.com',
        pass: 'NSYd@*kgTlBN',
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Test connection
    await transporter.verify()
    console.log('✅ Connection successful!')

    // Try to send actual email
    const info = await transporter.sendMail({
      from: '"SPK Beasiswa Test" <laporkkbupatikupang@rumahclick314.com>',
      to: 'laporkkbupatikupang@rumahclick314.com', // Send to self for testing
      subject: 'Test Email - SPK Beasiswa',
      html: '<h1>Email Test Successful!</h1><p>Konfigurasi email berhasil bekerja.</p>',
      text: 'Email Test Successful! Konfigurasi email berhasil bekerja.',
    })

    console.log('✅ Email sent successfully:', info.messageId)

    return NextResponse.json({
      success: true,
      message: 'Email berhasil dikirim!',
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    })
  } catch (error) {
    console.error('❌ Email send failed:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Email gagal dikirim',
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
