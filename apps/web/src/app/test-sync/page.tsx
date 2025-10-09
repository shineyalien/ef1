'use client'

import { useState, useEffect } from 'react'
import { syncService, SyncQueueItem } from '@/lib/sync-service'

export default function TestSyncPage() {
  const [syncStatus, setSyncStatus] = useState<any>(null)
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([])
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addTestResult = (message: string, isError: boolean = false) => {
    const timestamp = new Date().toLocaleTimeString()
    const prefix = isError ? '❌ ERROR' : '✅ SUCCESS'
    setTestResults(prev => [...prev, `[${timestamp}] ${prefix}: ${message}`])
  }

  const testSyncQueue = async () => {
    setIsLoading(true)
    addTestResult('Starting sync queue tests...')
    
    try {
      // Test 1: Add item to sync queue
      addTestResult('Testing add to sync queue...')
      const testItem = {
        type: 'invoice' as const,
        data: { id: 'test-123', customerName: 'Test Customer', amount: 100 },
        endpoint: '/api/invoices',
        method: 'POST'
      }
      
      const itemId = await syncService.addToSyncQueue(testItem)
      addTestResult(`Added item to sync queue with ID: ${itemId}`)
      
      // Test 2: Get sync queue
      addTestResult('Testing get sync queue...')
      const queue = await syncService.getSyncQueue()
      addTestResult(`Retrieved sync queue with ${queue.length} items`)
      setSyncQueue(queue)
      
      // Test 3: Update sync queue item
      addTestResult('Testing update sync queue item...')
      const updateSuccess = await syncService.updateSyncQueueItem(itemId, {
        status: 'failed' as const,
        retryCount: 1,
        error: 'Test error'
      })
      addTestResult(`Update sync queue item: ${updateSuccess ? 'SUCCESS' : 'FAILED'}`)
      
      // Test 4: Get sync status
      addTestResult('Testing get sync status...')
      const status = await syncService.getSyncStatus()
      addTestResult(`Retrieved sync status: ${JSON.stringify(status)}`)
      setSyncStatus(status)
      
      // Test 5: Remove item from sync queue
      addTestResult('Testing remove from sync queue...')
      const removeSuccess = await syncService.removeFromSyncQueue(itemId)
      addTestResult(`Remove from sync queue: ${removeSuccess ? 'SUCCESS' : 'FAILED'}`)
      
      // Test 6: Trigger sync
      addTestResult('Testing trigger sync...')
      const syncSuccess = await syncService.triggerSync()
      addTestResult(`Trigger sync: ${syncSuccess ? 'SUCCESS' : 'FAILED'}`)
      
      addTestResult('All sync queue tests completed!')
      
    } catch (error) {
      addTestResult(`Sync queue test failed: ${error}`, true)
      console.error('[TestSyncPage] Sync test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testDatabaseOperations = async () => {
    setIsLoading(true)
    addTestResult('Starting database operations tests...')
    
    try {
      // Test storage quota
      addTestResult('Testing storage quota...')
      const quota = await syncService.getStorageQuota()
      addTestResult(`Storage quota: ${quota.used} / ${quota.quota} bytes (${quota.percentage.toFixed(2)}%)`)
      
      // Test cleanup old data
      addTestResult('Testing cleanup old data...')
      await syncService.cleanupOldData()
      addTestResult('Cleanup old data completed')
      
      addTestResult('All database operations tests completed!')
      
    } catch (error) {
      addTestResult(`Database operations test failed: ${error}`, true)
      console.error('[TestSyncPage] Database test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllData = async () => {
    setIsLoading(true)
    addTestResult('Clearing all IndexedDB data...')
    
    try {
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases()
        for (const db of databases) {
          if (db.name?.includes('EasyFilerDB')) {
            await indexedDB.deleteDatabase(db.name)
            addTestResult(`Deleted database: ${db.name}`)
          }
        }
        addTestResult('All IndexedDB data cleared!')
      }
    } catch (error) {
      addTestResult(`Failed to clear data: ${error}`, true)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      const queue = await syncService.getSyncQueue()
      const status = await syncService.getSyncStatus()
      setSyncQueue(queue)
      setSyncStatus(status)
    } catch (error) {
      addTestResult(`Failed to refresh data: ${error}`, true)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Sync Service Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Test Controls</h2>
          <div className="space-y-2">
            <button
              onClick={testSyncQueue}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Running Tests...' : 'Test Sync Queue'}
            </button>
            <button
              onClick={testDatabaseOperations}
              disabled={isLoading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Running Tests...' : 'Test Database Operations'}
            </button>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400"
            >
              Refresh Data
            </button>
            <button
              onClick={clearAllData}
              disabled={isLoading}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              Clear All Data
            </button>
          </div>
        </div>
        
        {/* Sync Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Sync Status</h2>
          {syncStatus ? (
            <div className="space-y-2">
              <p><strong>Total Items:</strong> {syncStatus.totalItems}</p>
              <p><strong>Pending:</strong> {syncStatus.pendingItems}</p>
              <p><strong>Failed:</strong> {syncStatus.failedItems}</p>
              <p><strong>Conflicts:</strong> {syncStatus.conflictItems}</p>
              <p><strong>Is Syncing:</strong> {syncStatus.isSyncing ? 'Yes' : 'No'}</p>
              <p><strong>Last Sync:</strong> {syncStatus.lastSyncTime ? new Date(syncStatus.lastSyncTime).toLocaleString() : 'Never'}</p>
            </div>
          ) : (
            <p className="text-gray-500">No sync status available</p>
          )}
        </div>
      </div>
      
      {/* Sync Queue */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Sync Queue ({syncQueue.length} items)</h2>
        {syncQueue.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Retries</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {syncQueue.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm">{item.id.substring(0, 20)}...</td>
                    <td className="px-4 py-2 text-sm">{item.type}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'failed' ? 'bg-red-100 text-red-800' :
                        item.status === 'conflict' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{item.retryCount}</td>
                    <td className="px-4 py-2 text-sm">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-red-600">{item.error || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Sync queue is empty</p>
        )}
      </div>
      
      {/* Test Results */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Test Results</h2>
        <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded">
          {testResults.length > 0 ? (
            <div className="space-y-1 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className={result.includes('ERROR') ? 'text-red-600' : 'text-green-600'}>
                  {result}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No test results yet. Click the test buttons above.</p>
          )}
        </div>
      </div>
    </div>
  )
}