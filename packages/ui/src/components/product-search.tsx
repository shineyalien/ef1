import * as React from "react"
import { Input } from "./input"
import { Card, CardContent } from "./card"
import { cn } from "../lib/utils"

interface Product {
  id: string
  name: string
  description?: string
  hsCode: string
  unitPrice: number
  unitOfMeasurement: string
}

interface ProductSearchProps {
  className?: string
  onProductSelect?: (product: Product) => void
  products?: Product[]
}

const ProductSearch = React.forwardRef<HTMLDivElement, ProductSearchProps>(
  ({ className, onProductSelect, products = [] }, ref) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsCode.includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div ref={ref} className={cn("relative", className)}>
        <Input
          placeholder="Search products..."
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
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">
                  No products found
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      onProductSelect?.(product)
                      setSearchTerm(product.name)
                      setIsOpen(false)
                    }}
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.hsCode} • {product.unitOfMeasurement} • PKR {product.unitPrice}
                    </div>
                    {product.description && (
                      <div className="text-xs text-muted-foreground">{product.description}</div>
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

ProductSearch.displayName = "ProductSearch"

export { ProductSearch }