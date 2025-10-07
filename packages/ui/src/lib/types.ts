// UI-specific types and interfaces

export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  error?: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

export interface InvoiceItem {
  id: string
  description: string
  hsCode: string
  quantity: number
  unitPrice: number
  taxRate: number
  totalValue: number
  unitOfMeasurement: string
}

export interface InvoiceFormData {
  customerId?: string
  invoiceDate: string
  dueDate?: string
  documentType: string
  paymentMode: string
  taxPeriod: string
  scenarioId?: string
  referenceInvoiceNo?: string
  notes?: string
  items: InvoiceItem[]
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  ntnNumber?: string
  registrationType: 'REGISTERED' | 'UNREGISTERED'
}

export interface Product {
  id: string
  name: string
  description?: string
  hsCode: string
  unitPrice: number
  taxRate: number
  unitOfMeasurement: string
  category?: string
}

export interface FBRStatus {
  environment: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
  isConnected: boolean
  lastSync?: Date
  tokenValidated?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (value: any, record: T) => React.ReactNode
}

export interface TableProps<T = any> extends BaseComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface FormFieldProps extends BaseComponentProps {
  label: string
  required?: boolean
  error?: string
  description?: string
}

export interface SearchProps extends BaseComponentProps {
  placeholder?: string
  onSearch: (query: string) => void
  loading?: boolean
  results?: any[]
}

export interface StatusIndicatorProps extends BaseComponentProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export interface InvoicePreviewProps extends BaseComponentProps {
  invoice: {
    invoiceNumber: string
    invoiceDate: string
    dueDate?: string
    customer?: Customer
    items: InvoiceItem[]
    subtotal: number
    taxAmount: number
    totalAmount: number
    status: string
    fbrInvoiceNumber?: string
    qrCode?: string
  }
}

export interface FBRIntegrationProps extends BaseComponentProps {
  businessId: string
  onStatusChange?: (status: FBRStatus) => void
}