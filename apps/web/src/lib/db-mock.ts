import { PrismaClient } from '@prisma/client'

// Global Prisma client instance (singleton pattern)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Type definitions for mock database
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  subscriptionPlan: string
}

export interface Business {
  id: string
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
  fbrSetupComplete: boolean
  integrationMode: string
}

export interface Customer {
  id: string
  businessId: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  province?: string
  ntnNumber?: string
  registrationType: string
}

export interface Invoice {
  id: string
  businessId: string
  customerId?: string
  localInvoiceNumber: string
  invoiceSequence: number
  invoiceDate: string
  subtotal: number
  taxAmount: number
  totalAmount: number
  status: string
  mode: string
  fbrSubmitted: boolean
  fbrValidated: boolean
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  invoiceId: string
  description: string
  hsCode: string
  quantity: number
  unitPrice: number
  totalValue: number
  taxRate: number
  taxAmount: number
  unitOfMeasurement: string
}

// Mock database functions - we'll replace these with real Prisma calls later
class MockDB {
  // Users
  async getUser(email: string): Promise<User | null> {
    if (email === 'admin@easyfiler.com') {
      return {
        id: '1',
        email: 'admin@easyfiler.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+92-300-1234567',
        subscriptionPlan: 'PROFESSIONAL'
      }
    }
    return null
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...userData
    }
  }

  // Businesses
  async getBusinessesByUserId(userId: string): Promise<Business[]> {
    if (userId === '1') {
      return [{
        id: 'business-1',
        userId: '1',
        companyName: 'Easy Filer Demo Company',
        ntnNumber: '1234567',
        address: '123 Main Street, Lahore, Punjab',
        province: 'Punjab',
        city: 'Lahore',
        businessType: 'IT Services',
        sector: 'Technology',
        phoneNumber: '+92-42-123-4567',
        email: 'contact@easyfiler.com',
        fbrSetupComplete: false,
        integrationMode: 'LOCAL'
      }]
    }
    return []
  }

  async createBusiness(businessData: Omit<Business, 'id'>): Promise<Business> {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...businessData
    }
  }

  // Customers
  async getCustomersByBusinessId(businessId: string): Promise<Customer[]> {
    if (businessId === 'business-1') {
      return [
        {
          id: 'customer-1',
          businessId: 'business-1',
          name: 'Sample Customer Ltd',
          email: 'customer@example.com',
          phone: '+92-21-987-6543',
          address: '456 Business Street, Karachi',
          city: 'Karachi',
          province: 'Sindh',
          ntnNumber: '7654321',
          registrationType: 'REGISTERED'
        },
        {
          id: 'customer-2',
          businessId: 'business-1',
          name: 'John Doe',
          phone: '+92-300-555-1234',
          address: '789 Residential Area, Islamabad',
          city: 'Islamabad',
          province: 'Islamabad Capital Territory',
          registrationType: 'UNREGISTERED'
        }
      ]
    }
    return []
  }

  async createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...customerData
    }
  }

  // Invoices
  async getInvoicesByBusinessId(businessId: string): Promise<Invoice[]> {
    return [] // No invoices yet
  }

  async createInvoice(invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...invoiceData
    }
  }
}

export const db = new MockDB()