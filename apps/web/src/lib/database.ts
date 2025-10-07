import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client with proper singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Use the DATABASE_URL from the environment
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Real Database Service Implementation using Prisma
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
        phoneNumber: userData.phone, // Map phone to phoneNumber
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
    // Map city to sellerCity as per schema
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

  async updateBusiness(id: string, updateData: {
    integrationMode?: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
    fbrSetupComplete?: boolean
    sandboxValidated?: boolean
    sandboxToken?: string
    productionToken?: string
  }) {
    return this.db.business.update({
      where: { id },
      data: updateData
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

  async getCustomerById(id: string) {
    return this.db.customer.findUnique({
      where: { id }
    })
  }

  async updateCustomer(id: string, data: any) {
    return this.db.customer.update({
      where: { id },
      data
    })
  }

  async deleteCustomer(id: string) {
    return this.db.customer.delete({
      where: { id }
    })
  }

  // Invoice Management
  async createInvoice(invoiceData: {
    businessId: string
    customerId: string
    invoiceNumber: string
    invoiceDate: string
    customerName?: string
    customerAddress?: string
    customerNTN?: string
    items?: any[]
    subtotal: number
    taxAmount: number
    totalAmount: number
    notes?: string
  }) {
    // Get the next invoice sequence number for this business
    const lastInvoice = await this.db.invoice.findFirst({
      where: { businessId: invoiceData.businessId },
      orderBy: { invoiceSequence: 'desc' }
    })
    
    const nextSequence = (lastInvoice?.invoiceSequence ?? 0) + 1
    
    return this.db.invoice.create({
      data: {
        businessId: invoiceData.businessId,
        customerId: invoiceData.customerId,
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceSequence: nextSequence,
        invoiceDate: invoiceData.invoiceDate,
        notes: invoiceData.notes,
        subtotal: invoiceData.subtotal,
        taxAmount: invoiceData.taxAmount,
        totalAmount: invoiceData.totalAmount,
        status: 'DRAFT',
        // Handle invoice items separately if provided
        items: invoiceData.items ? {
          create: invoiceData.items.map((item: any) => {
            const baseValue = item.totalPrice || item.unitPrice * item.quantity
            const taxAmt = item.taxAmount || baseValue * (item.taxRate / 100)
            return {
              description: item.description,
              hsCode: item.hsCode || '85234010',
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              saleValue: item.unitPrice, // Required by Prisma
              totalValue: baseValue,
              valueSalesExcludingST: baseValue, // Required by Prisma
              taxRate: item.taxRate,
              taxAmount: taxAmt,
              salesTaxApplicable: taxAmt,
              unitOfMeasurement: item.unitOfMeasurement || 'UNIT'
            }
          })
        } : undefined
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
        business: true
      }
    })
  }

  async updateInvoice(id: string, data: any) {
    return this.db.invoice.update({
      where: { id },
      data
    })
  }

  async updateInvoiceWithFBRData(id: string, fbrData: {
    fbrSubmitted: boolean
    fbrValidated: boolean
    submissionTimestamp: Date
    fbrInvoiceNumber: string
    locallyGeneratedQRCode: string
    fbrTimestamp?: string
    fbrTransmissionId?: string
    fbrAcknowledgmentNumber?: string
    fbrResponse: any
    mode: 'SANDBOX' | 'PRODUCTION'
  }) {
    return this.db.invoice.update({
      where: { id },
      data: {
        fbrSubmitted: fbrData.fbrSubmitted,
        fbrValidated: fbrData.fbrValidated,
        submissionTimestamp: fbrData.submissionTimestamp,
        fbrInvoiceNumber: fbrData.fbrInvoiceNumber,
        qrCode: fbrData.locallyGeneratedQRCode,
        qrCodeData: fbrData.locallyGeneratedQRCode,
        fbrTimestamp: fbrData.fbrTimestamp,
        fbrTransactionId: fbrData.fbrTransmissionId,
        fbrResponseData: JSON.stringify(fbrData.fbrResponse), // Store as JSON string
        mode: fbrData.mode,
        status: fbrData.fbrValidated ? 'VALIDATED' : 'SUBMITTED'
      }
    })
  }

  // FBR Settings Management (stored in Business model)
  async upsertFBRSettings(businessId: string, settings: {
    sandboxToken?: string
    productionToken?: string
    environment?: 'SANDBOX' | 'PRODUCTION'
    fbrSetupComplete?: boolean
  }) {
    return this.db.business.update({
      where: { id: businessId },
      data: {
        sandboxToken: settings.sandboxToken,
        productionToken: settings.productionToken,
        integrationMode: settings.environment || 'LOCAL',
        fbrSetupComplete: settings.fbrSetupComplete ?? true
      }
    })
  }

  async getFBRSettingsByBusinessId(businessId: string) {
    const business = await this.db.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        sandboxToken: true,
        productionToken: true,
        integrationMode: true,
        fbrSetupComplete: true,
        fbrSetupSkipped: true
      }
    })
    
    return business ? {
      businessId: business.id,
      sandboxToken: business.sandboxToken,
      productionToken: business.productionToken,
      environment: business.integrationMode,
      isActive: business.fbrSetupComplete
    } : null
  }

  // Analytics and Reports
  async getInvoiceAnalytics(businessId: string, dateRange?: { from: Date; to: Date }) {
    const where = {
      businessId,
      ...(dateRange && {
        createdAt: {
          gte: dateRange.from,
          lte: dateRange.to
        }
      })
    }

    const [totalInvoices, totalRevenue, fbrSubmitted, pendingInvoices] = await Promise.all([
      this.db.invoice.count({ where }),
      this.db.invoice.aggregate({
        where,
        _sum: { totalAmount: true }
      }),
      this.db.invoice.count({
        where: { ...where, fbrSubmitted: true }
      }),
      this.db.invoice.count({
        where: { ...where, status: { in: ['DRAFT', 'SAVED'] } }
      })
    ])

    return {
      totalInvoices,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      fbrSubmitted,
      pendingInvoices
    }
  }

  // Utility methods
  async disconnect() {
    await this.db.$disconnect()
  }

  // Test database connection
  async testConnection() {
    try {
      await this.db.$queryRaw`SELECT 1`
      return { success: true, message: 'Database connection successful' }
    } catch (error) {
      return { success: false, message: `Database connection failed: ${error}` }
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()