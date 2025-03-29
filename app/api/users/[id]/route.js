import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        // Jangan sertakan password
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()

    // Validasi input
    if (!body.username || !body.email || !body.role) {
      return NextResponse.json({ error: 'Username, email, and role are required' }, { status: 400 })
    }

    // Cek apakah user ada
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Cek duplikasi email/username
    const userWithSameCreds = await prisma.user.findFirst({
      where: {
        AND: [
          { NOT: { id: params.id } },
          { OR: [{ email: body.email }, { username: body.username }] },
        ],
      },
    })

    if (userWithSameCreds) {
      return NextResponse.json(
        { error: 'Email or username already taken by another user' },
        { status: 409 }
      )
    }

    // Siapkan data update
    const updateData = {
      username: body.username,
      email: body.email,
      role: body.role,
    }

    // Hash password jika disediakan
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Cek apakah user ada
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Hapus user
    await prisma.user.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
