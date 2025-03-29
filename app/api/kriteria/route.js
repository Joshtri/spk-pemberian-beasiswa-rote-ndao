import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { getAuthUser } from '@/lib/auth' // ⬅️ import helper-nya

export async function GET(request) {
  try {
    const user = getAuthUser(request, ['ADMIN', 'CALON_PENERIMA']) // ✅ Hanya admin boleh GET
    const list = await prisma.kriteria.findMany()
    return NextResponse.json(list)
  } catch (err) {
    return handleAuthError(err)
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request, ['ADMIN']) // ✅ Hanya admin boleh POST
    const data = await request.json()
    const created = await prisma.kriteria.create({ data })
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    return handleAuthError(err)
  }
}

// Optional: bikin handler error biar reusable juga
function handleAuthError(err) {
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
