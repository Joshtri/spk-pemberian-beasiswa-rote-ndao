import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    console.log('=== DEBUGGING EMAIL CONFIGURATION ===')

    // Check environment variables
    const emailConfig = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS ? '***SET***' : 'NOT SET',
    }

    console.log('Email Config:', emailConfig)

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Environment variables tidak lengkap',
          config: emailConfig,
        },
        { status: 400 }
      )
    }

    // Test different configurations
    const configs = [
      {
        name: 'Domainesia SSL (465)',
        config: {
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3',
          },
          connectionTimeout: 60000,
          greetingTimeout: 30000,
          socketTimeout: 60000,
        },
      },
      {
        name: 'Domainesia TLS (587)',
        config: {
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      },
      {
        name: 'Domainesia Basic (25)',
        config: {
          host: process.env.SMTP_HOST,
          port: 25,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      },
      {
        name: 'Alternative Host (mail.rumahclick314.com)',
        config: {
          host: 'mail.rumahclick314.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      },
    ]

    for (const testConfig of configs) {
      try {
        console.log(`Testing ${testConfig.name}...`)
        const transporter = nodemailer.createTransport(testConfig.config)
        await transporter.verify()
        console.log(`✅ ${testConfig.name} works!`)

        return NextResponse.json({
          success: true,
          message: `Email configuration valid dengan ${testConfig.name}`,
          workingConfig: testConfig.name,
        })
      } catch (error) {
        console.log(`❌ ${testConfig.name} failed:`, error.message)
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Semua konfigurasi email gagal. Periksa kredensial SMTP.',
        config: emailConfig,
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Debug email error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error saat debugging email',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
