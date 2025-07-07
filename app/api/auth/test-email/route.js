import { NextResponse } from 'next/server'
import { testEmailConfig } from '@/lib/email'

export async function GET() {
  try {
    console.log('=== EMAIL CONFIGURATION TEST ===')
    const isConfigValid = await testEmailConfig()

    if (isConfigValid) {
      return NextResponse.json({
        success: true,
        message: 'Konfigurasi email valid dan siap digunakan',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Konfigurasi email tidak valid. Periksa pengaturan SMTP Anda.',
          details: 'Check console logs for detailed error information',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menguji konfigurasi email',
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
