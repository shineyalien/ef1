'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Package, Plus, DollarSign, Hash, Building, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SharedLoading } from "@/components/shared-loading"
import { SharedNavigation } from "@/components/shared-navigation"

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }

    loadProducts()
  }, [session, status])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch products from API
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error('Failed to fetch products:', response.statusText)
        setProducts([])
      }
      
    } catch (error) {
      console.error('Failed to load products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <SharedLoading message="Loading products..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <FileText className="h-8 w-8 text-blue-600" />
              </Link>
              <span className="text-xl font-bold text-gray-900">Easy Filer</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session?.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SharedNavigation
          backUrl="/dashboard"
          backLabel="Dashboard"
          showHome={false}
          currentPage="Products & Services"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products & Services</h1>
            <p className="text-gray-600">Manage your product catalog and service offerings.</p>
          </div>
          <Link href="/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Business Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Demo Business ({session?.user?.name})
            </CardTitle>
            <CardDescription>
              NTN: 1234567 • Punjab
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>
              {products.length} product{products.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first product or service to your catalog.</p>
                <Link href="/products/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {product.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {product.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Action Buttons */}
                      <div className="flex space-x-2 mb-3">
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/invoices/create?product=${product.id}`}>
                          <Button variant="outline" size="sm">
                            Create Invoice
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold flex items-center">
                          <DollarSign className="h-4 w-4" />
                          {product.unitPrice.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">HS Code:</span>
                        <span className="text-sm font-mono">{product.hsCode}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Unit:</span>
                        <span className="text-sm">{product.unitOfMeasurement}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tax Rate:</span>
                        <span className="text-sm">{product.taxRate}%</span>
                      </div>
                      
                      {product.sku && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">SKU:</span>
                          <span className="text-sm font-mono">{product.sku}</span>
                        </div>
                      )}
                      
                      {product.stock !== undefined && product.stock > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Stock:</span>
                          <Badge variant={product.stock > 10 ? "secondary" : "destructive"}>
                            {product.stock} units
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}