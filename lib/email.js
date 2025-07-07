import nodemailer from 'nodemailer'

// Create reusable transporter object with fallback configurations
const createTransporter = async () => {
  const configs = [
    {
      name: 'Working Host SSL',
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
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    },
    {
      name: 'Working Host TLS',
      host: 'mail.rumahclick314.com',
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
    {
      name: 'Working Host Plain',
      host: 'mail.rumahclick314.com',
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
  ]

  // Try each configuration until one works
  for (const config of configs) {
    try {
      const transporter = nodemailer.createTransport(config)
      await transporter.verify()
      console.log(`✅ Email transporter created successfully with ${config.name}`)
      return transporter
    } catch (error) {
      console.log(`❌ Failed with ${config.name}:`, error.message)
    }
  }

  // If all fail, throw error
  throw new Error('All email configurations failed')
}

// Send reset password email
export const sendResetPasswordEmail = async (email, resetUrl, userName = '') => {
  try {
    const transporter = await createTransporter()

    const mailOptions = {
      from: `"SPK Beasiswa Rote Ndao" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Password - SPK Beasiswa Rote Ndao',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Reset Password</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">SPK Beasiswa Rote Ndao</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-bottom: 20px;">
              ${userName ? `Halo ${userName},` : 'Halo,'}
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Kami menerima permintaan untuk mereset password akun Anda di sistem SPK Beasiswa Rote Ndao.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Klik tombol di bawah ini untuk mereset password Anda:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempel URL berikut ke browser Anda:
            </p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 14px; color: #333;">
              ${resetUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                <strong>Catatan Penting:</strong>
              </p>
              <ul style="font-size: 14px; color: #666; margin: 0; padding-left: 20px;">
                <li>Link ini hanya berlaku selama 1 jam</li>
                <li>Jika Anda tidak meminta reset password, abaikan email ini</li>
                <li>Untuk keamanan, jangan bagikan link ini kepada siapa pun</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="font-size: 14px; color: #666; margin: 0;">
                Tim SPK Beasiswa Rote Ndao<br>
                Kabupaten Rote Ndao
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Reset Password - SPK Beasiswa Rote Ndao
        
        ${userName ? `Halo ${userName},` : 'Halo,'}
        
        Kami menerima permintaan untuk mereset password akun Anda di sistem SPK Beasiswa Rote Ndao.
        
        Klik link berikut untuk mereset password Anda:
        ${resetUrl}
        
        Catatan Penting:
        - Link ini hanya berlaku selama 1 jam
        - Jika Anda tidak meminta reset password, abaikan email ini
        - Untuk keamanan, jangan bagikan link ini kepada siapa pun
        
        Tim SPK Beasiswa Rote Ndao
        Kabupaten Rote Ndao
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Test email configuration
export const testEmailConfig = async () => {
  try {
    console.log('Testing email configuration...')
    console.log('SMTP_HOST:', process.env.SMTP_HOST)
    console.log('SMTP_PORT:', process.env.SMTP_PORT)
    console.log('SMTP_USER:', process.env.SMTP_USER)
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***hidden***' : 'NOT SET')

    const transporter = await createTransporter()
    console.log('Email configuration is valid')
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
