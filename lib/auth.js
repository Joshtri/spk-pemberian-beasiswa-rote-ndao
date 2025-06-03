import jwt from 'jsonwebtoken'

export async function getAuthUser(request, allowedRoles = []) {
  try {
    // Ambil cookie dari header request
    const cookieHeader = request.headers.get('cookie') || ''
    const token = cookieHeader
      .split('; ')
      .find(c => c.startsWith('auth_token='))
      ?.split('=')[1]

    // Jika token tidak ditemukan
    if (!token) {
      return { error: 'TOKEN_MISSING', status: 401 }
    }

    // Verifikasi token JWT
    const user = jwt.verify(token, process.env.JWT_SECRET)

    // Cek apakah role diizinkan
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return { error: 'FORBIDDEN', status: 403 }
    }

    // Berhasil
    return { user, error: null, status: 200 }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { error: 'TOKEN_EXPIRED', status: 401 }
    }
    return { error: 'TOKEN_INVALID', status: 401 }
  }
}


import { cookies } from 'next/headers'
 
const JWT_SECRET = process.env.JWT_SECRET

// Fungsi utama: ambil user dari header atau cookie
export async function getAuthenticatedUser(req) {
  // 1. Cek Authorization header (Bearer token)
  const authHeader = req?.headers?.get('authorization') || req?.headers?.get('Authorization')

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return null
    }
  }

  // 2. Cek dari cookie (auth_token)
  try {
    const cookieStore = await cookies() // tidak perlu await, ini synchronous di Next.js 14+
    const token = cookieStore.get('auth_token')?.value

    if (!token) return null
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

// Generator token biasa
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}
