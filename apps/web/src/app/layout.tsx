import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/client-providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Easy Filer - FBR Compliant Invoicing',
  description: 'Pakistani invoicing software with FBR integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}