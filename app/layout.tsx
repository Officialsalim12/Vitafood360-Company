import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import AutoLogout from '@/components/AutoLogout'
import { CartProvider } from '@/components/CartContext'
import CartModal from '@/components/CartModal'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Vitafoods360 - Fresh Bakery & Healthy Foods',
  description: 'Premium bakery products, fresh bread, cakes, and healthy food options in Sierra Leone',
  keywords: 'bakery, bread, cakes, healthy food, Sierra Leone, Freetown',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <PerformanceMonitor />
          <AutoLogout />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <CartModal />
        </CartProvider>
      </body>
    </html>
  )
}
