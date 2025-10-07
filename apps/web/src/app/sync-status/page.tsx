'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { syncService, SyncQueueItem, SyncStatus } from '@/lib/sync-service'
import { storageManager, StorageStats, StorageQuota } from '@/lib/storage-manager'
import { useNetworkStatus } from '@/hooks/use-network-status'
// Simple date formatting function to avoid external dependency
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return options?.addSuffix ? 'just now' : 'less than a minute'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return options?.addSuffix ? `${diffInMinutes} minutes ago` : `${diffInMinutes} minutes`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return options?.addSuffix ? `${diffInHours} hours ago` : `${diffInHours} hours`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  return options?.addSuffix ? `${diffInDays} days ago` : `${diffInDays} days`
}
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database,
  Trash2,
  Download,
  Upload
} from 'lucide-react'

export default function SyncStatusPage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    totalItems: 0,
    pendingItems: 0,
    failedItems: 0,
    conflictItems: 0,
    syncedItems: 0,
    isSyncing: false
  })
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([])
  const [storageStats, setStorageStats] = useState<StorageStats>({
    invoices: { count: 0, size: 0 },
    customers: { count: 0, size: 0 },
    bulkOperations: { count: 0, size: 0 },
    syncQueue: { count: 0, size: 0 },
    autoDrafts: { count: 0, size: 0 },
    total: { count: 0, size: 0 }
  })
  const [storageQuota, setStorageQuota] = useState<StorageQuota>({
    used: 0,
    quota: 0,
    percentage: 0,
    isNearLimit: false,
    isOverLimit: false
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [storageRecommendation, setStorageRecommendation] = useState('')
  const { isOnline } = useNetworkStatus()

  // Load data on component mount
  useEffect(() => {
    loadSyncData()
    loadStorageData()
    
    // Set up listeners for real-time updates
    syncService.addSyncStatusListener(handleSyncStatusUpdate)
    
    return () => {
      syncService.removeSyncStatusListener(handleSyncStatusUpdate)
    }
  }, [])

  const handleSyncStatusUpdate = (status: SyncStatus) => {
    setSyncStatus(status)
  }

  const loadSyncData = async () => {
    try {
      const [status, queue] = await Promise.all([
        syncService.getSyncStatus(),
        syncService.getSyncQueue()
      ])
      
      setSyncStatus(status)
      setSyncQueue(queue)
    } catch (error) {
      console.error('Failed to load sync data:', error)
    }
  }

  const loadStorageData = async () => {
    try {
      const [stats, quota, recommendation] = await Promise.all([
        storageManager.getStorageStats(),
        storageManager.getStorageQuota(),
        storageManager.getStorageRecommendation()
      ])
      
      setStorageStats(stats)
      setStorageQuota(quota)
      setStorageRecommendation(recommendation)
    } catch (error) {
      console.error('Failed to load storage data:', error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        loadSyncData(),
        loadStorageData()
      ])
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleManualSync = async () => {
    await syncService.triggerSync()
    await loadSyncData()
  }

  const handleResolveConflict = async (itemId: string, resolution: 'local' | 'server' | 'merge') => {
    await syncService.resolveConflict(itemId, resolution)
    await loadSyncData()
  }

  const handleCleanupStorage = async () => {
    const result = await storageManager.cleanupOldData()
    await loadStorageData()
    
    // Show success message
    alert(`Cleanup completed: ${result.deleted} items deleted, ${result.freed} bytes freed`)
  }

  const handleOptimizeStorage = async () => {
    const result = await storageManager.optimizeStorage()
    await loadStorageData()
    
    // Show success message
    alert(`Optimization completed: ${result.saved} bytes saved`)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'conflict':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'synced':
        return <Badge variant="default" className="bg-green-500">Synced</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'conflict':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Conflict</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sync Status</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <>
                <Cloud className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600">Online</span>
              </>
            ) : (
              <>
                <CloudOff className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStatus.pendingItems}</div>
            <p className="text-xs text-muted-foreground">
              Items waiting to sync
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Sync</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStatus.failedItems}</div>
            <p className="text-xs text-muted-foreground">
              Items that failed to sync
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStatus.conflictItems}</div>
            <p className="text-xs text-muted-foreground">
              Items with conflicts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageQuota.percentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(storageQuota.used)} of {formatBytes(storageQuota.quota)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Warning */}
      {storageQuota.isNearLimit && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {storageRecommendation}
          </AlertDescription>
        </Alert>
      )}

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sync Status</CardTitle>
              <CardDescription>
                Last sync: {syncStatus.lastSyncTime ? 
                  formatDistanceToNow(new Date(syncStatus.lastSyncTime), { addSuffix: true }) : 
                  'Never'
                }
              </CardDescription>
            </div>
            <Button
              onClick={handleManualSync}
              disabled={!isOnline || syncStatus.isSyncing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {syncStatus.isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm">Sync in progress...</span>
              </>
            ) : isOnline ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Ready to sync</span>
              </>
            ) : (
              <>
                <CloudOff className="h-4 w-4 text-red-500" />
                <span className="text-sm">Offline - sync will resume when connection is restored</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Sync Queue</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Queue</CardTitle>
              <CardDescription>
                Items waiting to be synchronized with the server
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncQueue.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No items in sync queue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {syncQueue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-medium capitalize">{item.type}</p>
                          <p className="text-sm text-muted-foreground">
                            Created {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                          </p>
                          {item.retryCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Retries: {item.retryCount}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status)}
                        {item.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManualSync()}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Storage Usage</CardTitle>
                  <CardDescription>
                    Detailed breakdown of storage usage
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOptimizeStorage}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Optimize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCleanupStorage}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cleanup
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(storageStats).map(([key, value]) => (
                  key !== 'total' && (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{value.count} items</p>
                        <p className="text-sm text-muted-foreground">{formatBytes(value.size)}</p>
                      </div>
                    </div>
                  )
                ))}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <div className="text-right">
                      <p>{storageStats.total.count} items</p>
                      <p>{formatBytes(storageStats.total.size)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Conflicts</CardTitle>
              <CardDescription>
                Items that need conflict resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncQueue.filter(item => item.status === 'conflict').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No conflicts to resolve</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {syncQueue
                    .filter(item => item.status === 'conflict')
                    .map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-medium capitalize">{item.type}</p>
                            <p className="text-sm text-muted-foreground">
                              Created {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-orange-500 text-orange-500">
                            Conflict
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveConflict(item.id, 'local')}
                          >
                            Use Local
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveConflict(item.id, 'server')}
                          >
                            Use Server
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveConflict(item.id, 'merge')}
                          >
                            Merge
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}