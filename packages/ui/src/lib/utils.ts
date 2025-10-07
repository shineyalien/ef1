import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency for Pakistani Rupees
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

// Format date time for display
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Generate invoice number
export function generateInvoiceNumber(prefix: string, sequence: number): string {
  return `${prefix}-${String(sequence).padStart(6, '0')}`
}

// Validate NTN (National Tax Number) format
export function validateNTN(ntn: string): boolean {
  // NTN should be 7 digits for individuals or 7 digits + 3 letters for companies
  const ntnPattern = /^\d{7}(-[A-Z]{3})?$/
  return ntnPattern.test(ntn)
}

// Validate CNIC format
export function validateCNIC(cnic: string): boolean {
  // CNIC format: XXXXX-XXXXXXX-X or XXXXXXXXXXXXXXX
  const cnicPattern = /^\d{5}-\d{7}-\d{1}$|^\d{13}$/
  return cnicPattern.test(cnic)
}

// Calculate tax amount
export function calculateTax(amount: number, rate: number): number {
  return (amount * rate) / 100
}

// Calculate total with tax
export function calculateTotalWithTax(amount: number, rate: number): number {
  return amount + calculateTax(amount, rate)
}

// Get status color for invoices
export function getInvoiceStatusColor(status: string): string {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800'
    case 'SAVED':
      return 'bg-blue-100 text-blue-800'
    case 'SUBMITTED':
      return 'bg-yellow-100 text-yellow-800'
    case 'VALIDATED':
      return 'bg-green-100 text-green-800'
    case 'PUBLISHED':
      return 'bg-emerald-100 text-emerald-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}