import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get business
    const business = await getAuthenticatedBusiness()

    // Get form data
    const formData = await request.formData()
    const file = formData.get('logo') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File size too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with sharp (resize to max 800x800, optimize)
    const processedImage = await sharp(buffer)
      .resize(800, 800, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 90 })
      .toBuffer()

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'logos')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Generate unique filename
    const filename = `${business.id}-${Date.now()}.webp`
    const filepath = join(uploadsDir, filename)
    
    // Save file
    await writeFile(filepath, processedImage)

    // Update business with logo URL
    const logoUrl = `/uploads/logos/${filename}`
    await prisma.business.update({
      where: { id: business.id },
      data: { logoUrl }
    })

    return NextResponse.json({
      success: true,
      message: 'Logo uploaded successfully',
      logoUrl
    })

  } catch (error) {
    console.error('Logo upload error:', error)
    return NextResponse.json({
      error: 'Failed to upload logo',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE endpoint to remove logo
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get business
    const business = await getAuthenticatedBusiness()

    // Remove logo URL from database
    await prisma.business.update({
      where: { id: business.id },
      data: { logoUrl: null }
    })

    // Note: We don't delete the physical file for now (can implement later)

    return NextResponse.json({
      success: true,
      message: 'Logo removed successfully'
    })

  } catch (error) {
    console.error('Logo delete error:', error)
    return NextResponse.json({
      error: 'Failed to remove logo',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
