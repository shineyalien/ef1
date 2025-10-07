import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Button } from "./button"
import { cn } from "../lib/utils"

interface InvoiceFormProps {
  className?: string
  onSubmit?: (data: any) => void
  initialData?: any
}

const InvoiceForm = React.forwardRef<HTMLDivElement, InvoiceFormProps>(
  ({ className, onSubmit, initialData }, ref) => {
    const [formData, setFormData] = React.useState({
      customerName: "",
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
      items: [],
      ...initialData
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit?.(formData)
    }

    return (
      <Card ref={ref} className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                  Customer Name
                </label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium mb-1">
                  Invoice Number
                </label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, invoiceNumber: e.target.value }))}
                  placeholder="INV-001"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="invoiceDate" className="block text-sm font-medium mb-1">
                  Invoice Date
                </label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, invoiceDate: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit">
                Create Invoice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }
)

InvoiceForm.displayName = "InvoiceForm"

export { InvoiceForm }