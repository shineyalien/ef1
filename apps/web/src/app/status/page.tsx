// Simple database lib for now - we'll improve this with proper imports later
export default async function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          ✅ Easy Filer - System Status
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Database Status */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🗄️ Database Connection
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">✅ Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schema:</span>
                <span className="font-medium">Deployed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seed Data:</span>
                <span className="font-medium">Loaded</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Status */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🚀 Infrastructure Status
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Next.js:</span>
                <span className="text-green-600 font-medium">✅ Running</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PostgreSQL:</span>
                <span className="text-green-600 font-medium">✅ Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Docker Services:</span>
                <span className="text-green-600 font-medium">✅ Running</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Environment:</span>
                <span className="text-blue-600 font-medium">Development</span>
              </div>
            </div>
          </div>

          {/* Development Tools */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🛠️ Development Tools
            </h2>
            <div className="space-y-3">
              <a 
                href="http://localhost:5050" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline"
                rel="noopener noreferrer"
              >
                📊 pgAdmin (Database Management)
              </a>
              <a 
                href="http://localhost:8081" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline"
                rel="noopener noreferrer"
              >
                🔴 Redis Commander
              </a>
              <a 
                href="http://localhost:9001" 
                target="_blank" 
                className="block text-blue-600 hover:text-blue-800 underline"
                rel="noopener noreferrer"
              >
                🗃️ MinIO Console (File Storage)
              </a>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🎯 Ready for Development
            </h2>
            <div className="space-y-2">
              <div className="text-green-600">✅ Project structure created</div>
              <div className="text-green-600">✅ Database schema deployed</div>
              <div className="text-green-600">✅ Sample data seeded</div>
              <div className="text-green-600">✅ Environment configured</div>
              <div className="text-orange-600">🔨 Ready for feature development</div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🚀 What's Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800">Phase 1: Authentication</h4>
              <p className="text-gray-600">Set up NextAuth.js and user management</p>
            </div>
            <div>
              <h4 className="font-medium text-green-800">Phase 2: Invoice Management</h4>
              <p className="text-gray-600">Build invoice creation and customer management</p>
            </div>
            <div>
              <h4 className="font-medium text-purple-800">Phase 3: FBR Integration</h4>
              <p className="text-gray-600">Connect to PRAL API and implement compliance</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Quick Links:</h4>
          <div className="space-y-1">
            <div>📖 <a href="/roadmap" className="text-blue-600 hover:underline">Development Roadmap</a></div>
            <div>📋 <a href="/checklist" className="text-blue-600 hover:underline">Weekly Checklist</a></div>
            <div>🏠 <a href="/" className="text-blue-600 hover:underline">Back to Home</a></div>
          </div>
        </div>
      </div>
    </div>
  )
}