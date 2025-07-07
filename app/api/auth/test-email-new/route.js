import { NextResponse } from 'next/server'
import { testEmailConfigNew } from '@/lib/email-new'

export async function GET() {
  try {
    console.log('=== TESTING NEW EMAIL CONFIGURATION ===')
    const isConfigValid = await testEmailConfigNew()

    if (isConfigValid) {
      return NextResponse.json({
        success: true,
        message: 'Konfigurasi email baru valid dan siap digunakan',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Konfigurasi email baru tidak valid. Periksa pengaturan SMTP Anda.',
          details: 'Check console logs for detailed error information',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('New email test error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menguji konfigurasi email baru',
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
