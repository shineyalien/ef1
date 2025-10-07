import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import ClientWrapper from '@/components/client-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Easy Filer - FBR Compliant Invoicing',
  description: 'Modern invoicing software for Pakistani businesses with integrated FBR compliance',
  keywords: ['invoicing', 'FBR', 'Pakistan', 'tax compliance', 'PRAL API', 'PWA', 'mobile app'],
  authors: [{ name: 'Easy Filer Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Easy Filer',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Easy Filer" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.svg" />
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icons/icon-512x512.svg" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ClientWrapper>
            {children}
          </ClientWrapper>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'text-sm',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}