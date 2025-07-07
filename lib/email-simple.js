import nodemailer from 'nodemailer'

// Simple email configuration that works for most Indonesian hosting
const createSimpleTransporter = () => {
  return nodemailer.createTransport({
    host: 'mail.rumahclick314.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

// Send reset password email (simplified version)
export const sendResetPasswordEmailSimple = async (email, resetUrl, userName = '') => {
  try {
    const transporter = createSimpleTransporter()

    const mailOptions = {
      from: `"SPK Beasiswa Rote Ndao test" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Password - SPK Beasiswa Rote Ndao',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Password</h2>
          <p>Halo ${userName || 'User'},</p>
          <p>Klik link berikut untuk reset password Anda:</p>
          <p><a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>Atau copy link ini: ${resetUrl}</p>
          <p>Link ini berlaku selama 1 jam.</p>
          <p>Tim SPK Beasiswa Rote Ndao</p>
        </div>
      `,
      text: `
        Reset Password - SPK Beasiswa Rote Ndao
        
        Halo ${userName || 'User'},
        
        Klik link berikut untuk reset password: ${resetUrl}
        
        Link ini berlaku selama 1 jam.
        
        Tim SPK Beasiswa Rote Ndao
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

export default { sendResetPasswordEmailSimple }
