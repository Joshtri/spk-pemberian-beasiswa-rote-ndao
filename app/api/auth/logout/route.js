import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    })

    // 🔐 Hapus cookie `auth_token`
    response.cookies.set({
      name: 'auth_token',
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Logout Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal logout',
      },
      { status: 500 }
    )
  }
}
