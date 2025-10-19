import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: {
        email: email
      },
      data: {
        password: hashedPassword
      }
    })
    
    return NextResponse.json({
      success: true,
      email: updatedUser.email,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}