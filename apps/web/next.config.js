/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  transpilePackages: [
    // Note: Workspace packages will be added when they exist
    // Currently using local imports until monorepo is fully set up
  ],
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Fix for @react-pdf/renderer in server environment
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'react-pdf': 'commonjs react-pdf'
      })
    }
    
    // Suppress webpack cache warnings in development
    if (dev) {
      const originalEmit = config.infrastructureLogging?.level
      config.infrastructureLogging = {
        level: 'error',
      }
      
      // Filter out cache warnings specifically
      config.stats = {
        ...config.stats,
        warnings: false,
        warningsFilter: [
          /PackFileCacheStrategy/,
          /Serializing big strings/,
        ],
      }
    }
    
    return config
  }
}

module.exports = nextConfig