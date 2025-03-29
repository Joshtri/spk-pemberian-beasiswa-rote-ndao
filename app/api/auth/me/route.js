// app/api/auth/me/route.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    // 1. Ambil token dari cookies atau headers
    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Token tidak ditemukan',
          code: 'TOKEN_MISSING',
        },
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
          code: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
        {
          status: 401,
          headers: {
            'Set-Cookie': `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
          },
        }
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
        updatedAt: true,
        // Tambahan data khusus admin
        ...(decoded.role === 'ADMIN' && {
          _count: {
            select: {
              calonPenerima: true,
            },
          },
        }),
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          error: 'NotFound',
          message: 'User tidak ditemukan',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // 4. Response dengan data yang diformat
    return NextResponse.json(
      {
        success: true,
        data: {
          ...user,
          ...(decoded.role === 'ADMIN' && {
            stats: {
              totalCalonPenerima: user._count?.calonPenerima || 0,
            },
          }),
          // ⛔ Tambah token hanya untuk dev/debug
          ...(process.env.NODE_ENV !== 'production' && {
            token,
          }),
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-cache, no-store',
          ...(decoded.role === 'ADMIN' && {
            'X-Admin-Access': 'true',
          }),
        },
      }
    )
  } catch (error) {
    console.error('Auth Me Error:', error)
    return NextResponse.json(
      {
        error: 'ServerError',
        message: 'Terjadi kesalahan pada server',
        code: 'SERVER_ERROR',
        details:
          process.env.NODE_ENV === 'development'
            ? {
                message: error.message,
                stack: error.stack,
              }
            : undefined,
      },
      { status: 500 }
    )
  }
}
