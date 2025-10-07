import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, DollarSign, TrendingUp, Plus, Download, ArrowRight, Wifi, Smartphone, Package, LogOut } from "lucide-react"

async function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button variant="outline" size="sm" type="submit" className="text-xs sm:text-sm px-2 sm:px-3">
        <LogOut className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Sign Out</span>
        <span className="sm:hidden">Out</span>
      </Button>
    </form>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Responsive */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">Easy Filer</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">Welcome, {session.user?.name}</span>
              <Link href="/settings/profile">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">👤</span>
                </Button>
              </Link>
              <Link href="/settings/fbr">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">FBR Settings</span>
                  <span className="sm:hidden">FBR</span>
                </Button>
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Quick Actions - Mobile Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/invoices/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-300 h-full">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg mb-2 sm:mb-4">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Create Invoice</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">FBR compliant invoicing</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/invoices">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 hover:border-purple-300 h-full">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg mb-2 sm:mb-4">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">View All Invoices</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage invoices</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/customers/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-300 h-full">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg mb-2 sm:mb-4">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Add Customer</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Register new customer</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/products/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 hover:border-indigo-300 h-full">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg mb-2 sm:mb-4">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Add Product</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Add to product catalog</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-teal-200 hover:border-teal-300 h-full">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg mb-2 sm:mb-4">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">View All Products</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage product catalog</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/bulk-operations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 hover:border-purple-300 h-full">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg mb-2 sm:mb-4">
                  <Download className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Bulk Operations</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Import multiple invoices</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200 hover:border-orange-300 h-full">
              <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg mb-2 sm:mb-4">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Analytics</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Business insights</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">PKR 45,231</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Customers</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">FBR Submissions</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">10</div>
              <p className="text-xs text-muted-foreground">
                83% success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PWA Features Banner - Mobile */}
        <div className="block sm:hidden mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Mobile App Experience</h3>
                  <p className="text-xs text-gray-600 mt-1">Install Easy Filer for offline access and faster performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Recent Invoices</CardTitle>
              <CardDescription className="text-sm">Your latest invoice activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Invoice #INV-001</p>
                    <p className="text-sm text-gray-600">ABC Company - PKR 15,000</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    FBR Submitted
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Invoice #INV-002</p>
                    <p className="text-sm text-gray-600">XYZ Corp - PKR 8,500</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Draft
                  </span>
                </div>
              </div>
              <Link href="/invoices">
                <Button variant="ghost" className="w-full mt-4">
                  View all invoices
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FBR Integration Status</CardTitle>
              <CardDescription>Your PRAL API connection status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sandbox Environment</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Production Environment</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    Not Configured
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Sync</span>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
              </div>
              <Link href="/settings/fbr">
                <Button variant="outline" className="w-full mt-4">
                  Configure FBR Settings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}