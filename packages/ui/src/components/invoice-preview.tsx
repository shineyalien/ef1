import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { cn } from "../lib/utils"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  totalValue: number
}

interface InvoicePreviewProps {
  invoice: {
    invoiceNumber: string
    invoiceDate: string
    dueDate?: string
    customer?: {
      name: string
      address?: string
      ntnNumber?: string
    }
    items: InvoiceItem[]
    subtotal: number
    taxAmount: number
    totalAmount: number
    status: string
    fbrInvoiceNumber?: string
    qrCode?: string
  }
  className?: string
}

const InvoicePreview = React.forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice, className }, ref) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'DRAFT': return 'secondary'
        case 'SAVED': return 'outline'
        case 'SUBMITTED': return 'secondary'
        case 'VALIDATED': return 'default'
        case 'PUBLISHED': return 'default'
        case 'FAILED': return 'destructive'
        default: return 'outline'
      }
    }

    return (
      <Card ref={ref} className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Invoice #{invoice.invoiceNumber}</CardTitle>
              <p className="text-muted-foreground">Date: {invoice.invoiceDate}</p>
              {invoice.dueDate && (
                <p className="text-muted-foreground">Due: {invoice.dueDate}</p>
              )}
            </div>
            <div className="text-right">
              <Badge variant={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
              {invoice.fbrInvoiceNumber && (
                <p className="text-sm text-muted-foreground mt-2">
                  FBR IRN: {invoice.fbrInvoiceNumber}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {invoice.customer && (
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="font-medium">{invoice.customer.name}</p>
              {invoice.customer.address && (
                <p className="text-sm text-muted-foreground">{invoice.customer.address}</p>
              )}
              {invoice.customer.ntnNumber && (
                <p className="text-sm text-muted-foreground">NTN: {invoice.customer.ntnNumber}</p>
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">Description</th>
                    <th className="text-right p-3">Qty</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Tax</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.description}</td>
                      <td className="text-right p-3">{item.quantity}</td>
                      <td className="text-right p-3">PKR {item.unitPrice.toFixed(2)}</td>
                      <td className="text-right p-3">{item.taxRate}%</td>
                      <td className="text-right p-3 font-medium">PKR {item.totalValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/30">
                  <tr className="border-t">
                    <td colSpan={4} className="text-right p-3 font-semibold">Subtotal:</td>
                    <td className="text-right p-3">PKR {invoice.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right p-3 font-semibold">Tax:</td>
                    <td className="text-right p-3">PKR {invoice.taxAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t-2">
                    <td colSpan={4} className="text-right p-3 font-bold text-lg">Total:</td>
                    <td className="text-right p-3 font-bold text-lg">PKR {invoice.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {invoice.qrCode && (
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">FBR QR Code</p>
                <img src={invoice.qrCode} alt="FBR QR Code" className="w-32 h-32" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

InvoicePreview.displayName = "InvoicePreview"

export { InvoicePreview }