import * as React from "react"
import { Input } from "./input"
import { Card, CardContent } from "./card"
import { cn } from "../lib/utils"

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  ntnNumber?: string
}

interface CustomerSearchProps {
  className?: string
  onCustomerSelect?: (customer: Customer) => void
  customers?: Customer[]
}

const CustomerSearch = React.forwardRef<HTMLDivElement, CustomerSearchProps>(
  ({ className, onCustomerSelect, customers = [] }, ref) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)

    const filteredCustomers = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.ntnNumber?.includes(searchTerm)
    )

    return (
      <div ref={ref} className={cn("relative", className)}>
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        
        {isOpen && searchTerm && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
            <CardContent className="p-0">
              {filteredCustomers.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">
                  No customers found
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      onCustomerSelect?.(customer)
                      setSearchTerm(customer.name)
                      setIsOpen(false)
                    }}
                  >
                    <div className="font-medium">{customer.name}</div>
                    {customer.email && (
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    )}
                    {customer.ntnNumber && (
                      <div className="text-xs text-muted-foreground">NTN: {customer.ntnNumber}</div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }
)

CustomerSearch.displayName = "CustomerSearch"

export { CustomerSearch }