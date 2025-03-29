import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await prisma.user.findMany()

    // Hapus password dari setiap user sebelum dikirim
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return Response.json(usersWithoutPassword)
  } catch (error) {
    console.error('Error fetching users:', error)
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/users
export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.username || !body.email || !body.password || !body.role) {
      return NextResponse.json(
        { error: 'Username, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.username }],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
