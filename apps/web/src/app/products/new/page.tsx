'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    hsCode: '',
    unitOfMeasurement: '',
    salesTaxRate: '18'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          unitPrice: parseFloat(formData.unitPrice),
          salesTaxRate: parseFloat(formData.salesTaxRate)
        })
      })

      if (response.ok) {
        router.push('/products')
      } else {
        console.error('Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="hsCode">HS Code</Label>
              <Input
                id="hsCode"
                name="hsCode"
                value={formData.hsCode}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="unitOfMeasurement">Unit of Measurement</Label>
              <Input
                id="unitOfMeasurement"
                name="unitOfMeasurement"
                value={formData.unitOfMeasurement}
                onChange={handleChange}
                placeholder="e.g., kg, pcs, liters"
              />
            </div>

            <div>
              <Label htmlFor="salesTaxRate">Sales Tax Rate (%)</Label>
              <Input
                id="salesTaxRate"
                name="salesTaxRate"
                type="number"
                step="0.01"
                value={formData.salesTaxRate}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}