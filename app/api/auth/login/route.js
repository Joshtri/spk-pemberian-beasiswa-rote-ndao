import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({
        error: 'ValidationError',
        message: 'Email dan password wajib diisi',
        fields: {
          ...(!email && { email: 'Email harus diisi' }),
          ...(!password && { password: 'Password harus diisi' })
        }
      }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        username: true
      }
    })

    if (!user) {
      return NextResponse.json({
        error: 'AuthError',
        message: 'Email atau password salah'
      }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({
        error: 'AuthError',
        message: 'Email atau password salah'
      }, { status: 401 })
    }

    const token = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    }, process.env.JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'beasiswa-rote-ndao'
    })

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // penting
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: 'ServerError',
      message: 'Terjadi kesalahan saat login'
    }, { status: 500 })
  }
}
