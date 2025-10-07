import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/database'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  // Business data
  companyName: z.string().min(1),
  ntnNumber: z.string().min(1),
  address: z.string().min(1),
  province: z.string().min(1),
  city: z.string().optional(),
  businessType: z.string().min(1),
  sector: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Registration request received:', { email: body.email, firstName: body.firstName, lastName: body.lastName, companyName: body.companyName })
    
    const validatedData = registerSchema.parse(body)
    const { email, password, firstName, lastName, phone, companyName, ntnNumber, address, province, city, businessType, sector } = validatedData

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      console.log('⚠️ User already exists:', email)
      return NextResponse.json({ 
        success: false, 
        message: 'User already exists with this email' 
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('🔐 Password hashed successfully')

    // Create user
    console.log('💾 Creating user in database...')
    const user = await db.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone
    })
    console.log('✅ User created successfully:', { id: user.id, email: user.email })

    // Create business for the user
    console.log('🏢 Creating business in database...')
    const business = await db.createBusiness({
      userId: user.id,
      companyName,
      ntnNumber,
      address,
      province,
      city: city || '',
      businessType,
      sector
    })
    console.log('✅ Business created successfully:', { id: business.id, companyName: business.companyName })

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Account and business created successfully',
      user: userWithoutPassword,
      business: {
        id: business.id,
        companyName: business.companyName,
        ntnNumber: business.ntnNumber
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}