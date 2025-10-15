import ClientLayoutWrapper from './client-layout-wrapper'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, DollarSign, TrendingUp, Plus, Download, ArrowRight, Wifi, Smartphone, Package, Zap, Shield, CheckCircle, Star } from 'lucide-react'

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <ClientLayoutWrapper>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Easy Filer v3
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              FBR-Compliant Invoicing Made Simple. Create, manage, and submit invoices to the Federal Board of Revenue with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/invoices/create">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Create Invoice
                  <Plus className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your invoicing and stay compliant with FBR regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>FBR-Compliant Invoices</CardTitle>
                <CardDescription>
                  Generate invoices that meet all FBR requirements with automatic tax calculations and proper formatting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Rapid Invoice Creator</CardTitle>
                <CardDescription>
                  Create invoices quickly with our spreadsheet-style interface. Perfect for high-volume invoicing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Secure FBR Integration</CardTitle>
                <CardDescription>
                  Direct integration with PRAL API for real-time submission and validation of your invoices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Track your business performance with detailed analytics and generate reports for tax filing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
                  <Smartphone className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Mobile App Experience</CardTitle>
                <CardDescription>
                  Access your invoices anywhere with our mobile-optimized interface and offline capabilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <Download className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Bulk Operations</CardTitle>
                <CardDescription>
                  Import multiple invoices from Excel/CSV files and process them in bulk for efficiency.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get Started Quickly
            </h2>
            <p className="text-xl text-gray-600">
              Choose what you want to do right now
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/invoices/create">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-300 h-full">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Create Invoice</h3>
                  <p className="text-sm text-gray-600 mt-1">Start invoicing</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/customers/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-300 h-full">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Add Customer</h3>
                  <p className="text-sm text-gray-600 mt-1">Register client</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/products/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 hover:border-indigo-300 h-full">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Add Product</h3>
                  <p className="text-sm text-gray-600 mt-1">Add to catalog</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/bulk-operations">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 hover:border-purple-300 h-full">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Bulk Import</h3>
                  <p className="text-sm text-gray-600 mt-1">Import multiple</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Businesses Across Pakistan
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about Easy Filer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Easy Filer has transformed how we handle our invoicing. What used to take hours now takes minutes!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Ahmed Khan</p>
                    <p className="text-sm text-gray-600">Retail Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The FBR integration is seamless. We've never had compliance issues since switching to Easy Filer."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Sara Ahmed</p>
                    <p className="text-sm text-gray-600">Accounting Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The bulk import feature saved us countless hours. Highly recommend for any business with high volume."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Muhammad Ali</p>
                    <p className="text-sm text-gray-600">Distribution Company</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Simplify Your Invoicing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust Easy Filer for their FBR-compliant invoicing needs.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </ClientLayoutWrapper>
  )
}