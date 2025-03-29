import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const { username, email, password } = await req.json()

    // Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, dan password wajib diisi' },
        { status: 400 }
      )
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Validasi panjang password
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Periksa apakah username atau email sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          error: existingUser.username === username 
            ? 'Username sudah digunakan' 
            : 'Email sudah terdaftar'
        },
        { status: 409 }
      )
    }

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Buat user baru dengan role CALON_PENERIMA
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'CALON_PENERIMA'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json(
      {
        message: 'Pendaftaran berhasil!',
        user: newUser
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat pendaftaran' },
      { status: 500 }
    )
  }
}