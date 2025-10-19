import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Get the user from database
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    return NextResponse.json({
      email: user.email,
      isPasswordValid,
      hashedPassword: user.password
    })
  } catch (error) {
    console.error('Error testing password:', error)
    return NextResponse.json(
      { error: 'Failed to test password' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}