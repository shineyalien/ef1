import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, FileText, Shield, Zap, Globe, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Easy Filer</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/status">
                <Button variant="ghost">System Status</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            FBR-Compliant <span className="text-blue-600">Invoicing</span> Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Modern invoicing software for Pakistani businesses with integrated FBR compliance, 
            PRAL API integration, and seamless tax filing capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for FBR Compliance
            </h2>
            <p className="text-xl text-gray-600">
              Built specifically for Pakistani businesses following SRO 69(I)/2025 requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>FBR Compliance</CardTitle>
                <CardDescription>
                  Full compliance with SRO 69(I)/2025 including 26 mandatory fields, 
                  QR codes, and real-time transmission to FBR systems.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>PRAL Integration</CardTitle>
                <CardDescription>
                  Direct integration with FBR's PRAL API for seamless invoice 
                  submission, validation, and automatic tax return population.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Offline-First Design</CardTitle>
                <CardDescription>
                  Create invoices offline and sync when connected. 24-hour upload 
                  window during internet/power failures as per FBR requirements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Multi-Business Support</CardTitle>
                <CardDescription>
                  Manage multiple businesses under one account with proper 
                  data isolation and individual FBR integration for each.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Bulk Operations</CardTitle>
                <CardDescription>
                  Import and process thousands of invoices via CSV/XLSX with 
                  batch validation and submission to FBR systems.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>
                  Complete 6-year electronic storage with full audit trail 
                  and compliance reporting for FBR requirements.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Simplify Your FBR Compliance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Pakistani businesses already using Easy Filer 
            for seamless invoicing and tax compliance.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6" />
                <span className="text-lg font-semibold">Easy Filer</span>
              </div>
              <p className="text-gray-400">
                Modern FBR-compliant invoicing for Pakistani businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white">Features</Link></li>
                <li><Link href="/auth/register" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/auth/login" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">FBR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Easy Filer. All rights reserved. Built for Pakistani businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}