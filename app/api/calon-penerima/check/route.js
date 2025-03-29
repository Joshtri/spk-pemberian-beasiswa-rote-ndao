// lib/auth.js
import jwt from 'jsonwebtoken'
// app/api/calon-penerima/protected-example/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export function getAuthUser(request, allowedRoles = []) {
  const token =
    request.cookies.get('auth_token')?.value || request.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    const err = new Error('Token tidak ditemukan')
    err.code = 'TOKEN_MISSING'
    throw err
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      err.code = 'TOKEN_EXPIRED'
    } else {
      err.code = 'TOKEN_INVALID'
    }
    throw err
  }

  if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
    const err = new Error('Role tidak diizinkan')
    err.code = 'FORBIDDEN'
    throw err
  }

  return decoded
}

export async function GET(request) {
  try {
    const user = getAuthUser(request, ['CALON_PENERIMA'])

    const existing = await prisma.calonPenerima.findFirst({
      where: { userId: user.id },
    })

    return NextResponse.json({
      onboarded: !!existing, // true jika sudah isi data, false jika belum
    })
  } catch (err) {
    if (err.code === 'TOKEN_MISSING') {
      return NextResponse.json({ message: 'Unauthorized: silakan login' }, { status: 401 })
    }
    if (err.code === 'FORBIDDEN') {
      return NextResponse.json({ message: 'Akses dilarang untuk role ini' }, { status: 403 })
    }
    if (err.code === 'TOKEN_EXPIRED') {
      return NextResponse.json({ message: 'Token kadaluarsa' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 })
  }
}

// function handleAuthError(err) {
//   if (err.code === 'TOKEN_MISSING') {
//     return NextResponse.json({ message: 'Unauthorized: silakan login' }, { status: 401 })
//   }
//   if (err.code === 'FORBIDDEN') {
//     return NextResponse.json({ message: 'Akses dilarang untuk role ini' }, { status: 403 })
//   }
//   if (err.code === 'TOKEN_EXPIRED') {
//     return NextResponse.json({ message: 'Token kadaluarsa' }, { status: 401 })
//   }
//   return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 })
// }
