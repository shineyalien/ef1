import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client with proper singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Database Service Implementation
export class DatabaseService {
  private db = prisma

  // User Management
  async createUser(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    return this.db.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phone,
        country: 'Pakistan',
        isActive: true
      }
    })
  }

  async getUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email }
    })
  }

  async getUserById(id: string) {
    return this.db.user.findUnique({
      where: { id }
    })
  }

  // Business Management
  async createBusiness(businessData: {
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string
    businessType: string
    sector: string
  }) {
    const { city, ...rest } = businessData
    return this.db.business.create({
      data: {
        ...rest,
        sellerCity: city || null
      }
    })
  }

  async getBusinessesByUserId(userId: string) {
    return this.db.business.findMany({
      where: { userId },
      include: {
        user: true
      }
    })
  }

  async getBusinessById(id: string) {
    return this.db.business.findUnique({
      where: { id },
      include: {
        user: true
      }
    })
  }

  // Customer Management
  async createCustomer(customerData: {
    businessId: string
    name: string
    email?: string
    phone?: string
    address: string
    ntnNumber?: string
    businessType: string
    province: string
  }) {
    return this.db.customer.create({
      data: customerData
    })
  }

  async getCustomersByBusinessId(businessId: string) {
    return this.db.customer.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Invoice Management
  async createInvoice(invoiceData: any) {
    const lastInvoice = await this.db.invoice.findFirst({
      where: { businessId: invoiceData.businessId },
      orderBy: { invoiceSequence: 'desc' }
    })
    
    const nextSequence = (lastInvoice?.invoiceSequence ?? 0) + 1
    
    return this.db.invoice.create({
      data: {
        ...invoiceData,
        invoiceSequence: nextSequence
      }
    })
  }

  async getInvoicesByBusinessId(businessId: string) {
    return this.db.invoice.findMany({
      where: { businessId },
      include: {
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getInvoiceById(id: string) {
    return this.db.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        business: true,
        items: true
      }
    })
  }

  // Test connection
  async testConnection() {
    try {
      await this.db.$queryRaw`SELECT 1`
      return { success: true, message: 'Database connection successful' }
    } catch (error) {
      return { success: false, message: `Database connection failed: ${error}` }
    }
  }

  async disconnect() {
    await this.db.$disconnect()
  }
}

// Export singleton instance
export const db = new DatabaseService()