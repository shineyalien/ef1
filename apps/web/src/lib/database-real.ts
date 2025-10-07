import { PrismaClient } from '@prisma/client'

// Import types from our generated Prisma schema
type User = {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  country: string
  isActive: boolean
  subscriptionPlan: string
  createdAt: Date
  updatedAt: Date
}

type Business = {
  id: string
  userId: string
  companyName: string
  ntnNumber: string
  address: string
  province: string
  businessType: string
  sector: string
  fbrSetupComplete: boolean
  fbrSetupSkipped: boolean
  sandboxToken: string | null
  productionToken: string | null
  integrationMode: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
  sandboxValidated: boolean
  productionTokenAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

type Customer = {
  id: string
  businessId: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  ntnNumber: string | null
  registrationType: 'REGISTERED' | 'UNREGISTERED'
  createdAt: Date
  updatedAt: Date
}

type Invoice = {
  id: string
  businessId: string
  customerId: string | null
  invoiceNumber: string
  fbrInvoiceNumber: string | null
  invoiceDate: Date
  dueDate: Date
  subtotal: number
  taxAmount: number
  totalAmount: number
  status: 'DRAFT' | 'PENDING' | 'VALIDATED' | 'SUBMITTED' | 'FAILED'
  fbrSubmitted: boolean
  fbrValidated: boolean
  mode: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
  submissionTimestamp: Date | null
  qrCode: string | null
  createdAt: Date
  updatedAt: Date
}

type Product = {
  id: string
  businessId: string
  name: string
  description: string | null
  hsCode: string
  unitOfMeasurement: string
  unitPrice: number
  taxRate: number
  category: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Global Prisma client instance (singleton pattern)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Define the interfaces for data creation
interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  country?: string
}

interface CreateBusinessData {
  userId: string
  companyName: string
  ntnNumber: string
  address: string
  province: string
  businessType: string
  sector: string
}

interface CreateCustomerData {
  businessId: string
  name: string
  email?: string
  phone?: string
  address?: string
  ntnNumber?: string
  registrationType?: 'REGISTERED' | 'UNREGISTERED'
}

interface CreateInvoiceData {
  businessId: string
  customerId?: string
  invoiceNumber: string
  invoiceDate: Date
  dueDate: Date
  subtotal: number
  taxAmount: number
  totalAmount: number
  status?: 'DRAFT' | 'PENDING' | 'VALIDATED' | 'SUBMITTED' | 'FAILED'
  mode?: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
}

interface CreateProductData {
  businessId: string
  name: string
  description?: string
  hsCode: string
  unitOfMeasurement: string
  unitPrice: number
  taxRate: number
  category?: string
  isActive?: boolean
}

// Database service class using real Prisma client
class DatabaseService {
  // Users
  async getUser(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { businesses: true }
    })
  }

  async createUser(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    return await prisma.user.create({
      data: userData
    })
  }

  // Businesses
  async getBusinessesByUserId(userId: string) {
    return await prisma.business.findMany({
      where: { userId },
      include: {
        customers: true,
        invoices: true
      }
    })
  }

  async createBusiness(businessData: {
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string
    businessType: string
    sector: string
    phoneNumber?: string
    email?: string
  }) {
    return await prisma.business.create({
      data: businessData
    })
  }

  // Customers
  async getCustomersByBusinessId(businessId: string) {
    return await prisma.customer.findMany({
      where: { businessId }
    })
  }

  async createCustomer(customerData: {
    businessId: string
    name: string
    email?: string
    phone?: string
    address: string
    city?: string
    province: string
    ntnNumber?: string
    registrationType: 'REGISTERED' | 'UNREGISTERED'
  }) {
    return await prisma.customer.create({
      data: customerData
    })
  }

  // Invoices
  async getInvoicesByBusinessId(businessId: string) {
    return await prisma.invoice.findMany({
      where: { businessId },
      include: {
        items: true,
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async createInvoice(invoiceData: {
    businessId: string
    customerId?: string
    localInvoiceNumber: string
    invoiceSequence: number
    invoiceDate: string
    subtotal: number
    taxAmount: number
    totalAmount: number
    status: 'DRAFT' | 'PENDING' | 'VALIDATED' | 'SUBMITTED' | 'FAILED'
    mode: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
    items: {
      description: string
      hsCode: string
      quantity: number
      unitPrice: number
      totalValue: number
      taxRate: number
      taxAmount: number
      unitOfMeasurement: string
    }[]
  }) {
    const { items, ...invoiceFields } = invoiceData
    return await prisma.invoice.create({
      data: {
        ...invoiceFields,
        items: {
          create: items.map(item => ({
            description: item.description,
            hsCode: item.hsCode,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            saleValue: item.unitPrice,
            totalValue: item.totalValue,
            valueSalesExcludingST: item.totalValue,
            taxRate: item.taxRate,
            taxAmount: item.taxAmount,
            salesTaxApplicable: item.taxAmount,
            unitOfMeasurement: item.unitOfMeasurement
          }))
        }
      } as any, // Type assertion for spread operator compatibility
      include: {
        items: true,
        customer: true
      }
    })
  }

  async getInvoiceById(invoiceId: string) {
    return await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        customer: true,
        business: true
      }
    })
  }
}

export const db = new DatabaseService()