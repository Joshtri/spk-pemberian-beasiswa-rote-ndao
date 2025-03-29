import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    // 1. Ambil token dari cookies
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    // 2. Verifikasi token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Token tidak valid',
          details:
            err.name === 'TokenExpiredError' ? 'Token telah kadaluarsa' : 'Token tidak valid',
        },
        { status: 401 }
      )
    }

    // 3. Cari user di database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        // Tambahkan field lain yang diperlukan tanpa sensitive data
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'NotFound', message: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // 4. Return data user
    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Auth Me Error:', error)
    return NextResponse.json(
      {
        error: 'ServerError',
        message: 'Terjadi kesalahan pada server',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
