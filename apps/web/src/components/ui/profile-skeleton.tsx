import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-4xl mx-auto">
        {/* Navigation Skeleton */}
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex justify-end pt-4">
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences Card Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-6 w-11" />
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings Card Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-64 mb-3" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-64 mb-3" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-3 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div>
                  <Skeleton className="h-3 w-28 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div>
                  <Skeleton className="h-3 w-28 mb-1" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}