import { NextResponse } from 'next/server'

// Bisa ditaruh di file `lib/error.js` atau langsung di setiap route
export function handleAuthError(err) {
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
  