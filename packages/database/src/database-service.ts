// Database Service Layer for Easy Filer
// Provides high-level database operations

import { PrismaClient } from '@prisma/client'
import { prisma } from './prisma-client'

// User operations
export const userService = {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        businesses: {
          take: 1
        }
      }
    })
  },

  async create(userData: any) {
    return await prisma.user.create({
      data: userData,
      include: {
        businesses: true
      }
    })
  },

  async update(id: string, userData: any) {
    return await prisma.user.update({
      where: { id },
      data: userData,
      include: {
        businesses: true
      }
    })
  }
}

// Business operations
export const businessService = {
  async findByUserId(userId: string) {
    return await prisma.business.findMany({
      where: { userId },
      include: {
        customers: true,
        products: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })
  },

  async create(businessData: any) {
    return await prisma.business.create({
      data: businessData,
      include: {
        customers: true,
        products: true
      }
    })
  },

  async update(id: string, businessData: any) {
    return await prisma.business.update({
      where: { id },
      data: businessData,
      include: {
        customers: true,
        products: true
      }
    })
  }
}

// Customer operations
export const customerService = {
  async findByBusinessId(businessId: string) {
    return await prisma.customer.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async create(customerData: any) {
    return await prisma.customer.create({
      data: customerData
    })
  },

  async update(id: string, customerData: any) {
    return await prisma.customer.update({
      where: { id },
      data: customerData
    })
  },

  async delete(id: string) {
    return await prisma.customer.delete({
      where: { id }
    })
  }
}

// Product operations
export const productService = {
  async findByBusinessId(businessId: string) {
    return await prisma.product.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async create(productData: any) {
    return await prisma.product.create({
      data: productData
    })
  },

  async update(id: string, productData: any) {
    return await prisma.product.update({
      where: { id },
      data: productData
    })
  },

  async delete(id: string) {
    return await prisma.product.delete({
      where: { id }
    })
  }
}

// Invoice operations
export const invoiceService = {
  async findByBusinessId(businessId: string, options?: { limit?: number; offset?: number }) {
    const { limit = 50, offset = 0 } = options || {}
    
    return await prisma.invoice.findMany({
      where: { businessId },
      include: {
        customer: true,
        items: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  },

  async findById(id: string) {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        business: true
      }
    })
  },

  async create(invoiceData: any) {
    return await prisma.invoice.create({
      data: {
        ...invoiceData,
        items: {
          create: invoiceData.items
        }
      },
      include: {
        customer: true,
        items: true
      }
    })
  },

  async update(id: string, invoiceData: any) {
    const { items, ...invoiceFields } = invoiceData
    
    return await prisma.invoice.update({
      where: { id },
      data: {
        ...invoiceFields,
        ...(items && {
          items: {
            deleteMany: {},
            create: items
          }
        })
      },
      include: {
        customer: true,
        items: true
      }
    })
  },

  async delete(id: string) {
    return await prisma.invoice.delete({
      where: { id }
    })
  },

  async getNextSequence(businessId: string) {
    const lastInvoice = await prisma.invoice.findFirst({
      where: { businessId },
      orderBy: { invoiceSequence: 'desc' }
    })
    
    return (lastInvoice?.invoiceSequence || 0) + 1
  }
}

// FBR Data operations
export const fbrDataService = {
  async getProvinces() {
    return await prisma.fBRProvince.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' }
    })
  },

  async getHSCodes() {
    return await prisma.fBRHSCode.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' }
    })
  },

  async getUOMs() {
    return await prisma.fBRUnitOfMeasurement.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' }
    })
  },

  async getTaxRates(params: any) {
    return await prisma.fBRTaxRate.findMany({
      where: {
        hsCode: params.hsCode,
        sellerProvince: params.sellerProvince,
        buyerProvince: params.buyerProvince
      },
      orderBy: { rate: 'desc' }
    })
  }
}

// Export all services
export const db = {
  user: userService,
  business: businessService,
  customer: customerService,
  product: productService,
  invoice: invoiceService,
  fbrData: fbrDataService,
  prisma // Direct access to prisma client if needed
}

// Export for backward compatibility
export { prisma }