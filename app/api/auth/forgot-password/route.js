import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { sendResetPasswordEmailNew } from '@/lib/email-new'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email wajib diisi' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    try {
      // Send reset password email
      await sendResetPasswordEmailNew(user.email, resetUrl, user.name)

      return NextResponse.json({
        success: true,
        message: 'Link reset password telah dikirim ke email Anda',
        // In development, include the reset URL for testing
        ...(process.env.NODE_ENV === 'development' && { resetUrl }),
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)

      // If email fails, still return success but log the error
      // In development, include the reset URL for testing
      return NextResponse.json({
        success: true,
        message: 'Link reset password telah dikirim ke email Anda',
        ...(process.env.NODE_ENV === 'development' && {
          resetUrl,
          emailError: 'Email gagal dikirim, gunakan link berikut untuk testing',
        }),
      })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}
