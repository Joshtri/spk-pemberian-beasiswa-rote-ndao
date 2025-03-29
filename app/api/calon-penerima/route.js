// app/api/calon-penerima/check/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  const token =
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ onboarded: false, error: 'Token missing' }, { status: 401 })
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return NextResponse.json({ onboarded: false, error: 'Token invalid' }, { status: 401 })
  }

  const userId = decoded.id

  const existing = await prisma.calonPenerima.findFirst({
    where: { userId },
    select: { id: true },
  })

  return NextResponse.json({ onboarded: !!existing })
}
