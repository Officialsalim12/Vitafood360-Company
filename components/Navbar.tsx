'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, ShoppingCart, LogIn } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/components/CartContext'

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { count, openCart } = useCart()

  useEffect(() => {
    let unsub: (() => void) | undefined
    let canceled = false

    const run = () => {
      if (canceled) return
      supabase.auth.getUser().then(({ data, error }) => {
        if (!error && !canceled) {
          setUser(data.user)
        }
      })
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!canceled) setUser(session?.user ?? null)
      })
      unsub = () => listener?.subscription.unsubscribe()
    }

    const idleId: number = 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(run)
      : (setTimeout(run, 0) as unknown as number)

    return () => {
      canceled = true
      if (unsub) unsub()
      if ('cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleId)
      } else {
        clearTimeout(idleId as unknown as number)
      }
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use flex with justify-between for left, center, right */}
        <div className="flex items-center h-32 md:h-36 justify-between">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center h-full">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/home/vitafoods360-logo.jpg"
                alt="Vitafoods360 Logo"
                width={300}
                height={150}
                quality={75}
                className="h-28 md:h-32 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-10 justify-center flex-1">
            <Link href="/" className="text-gray-900 hover:text-primary-600 text-lg font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-900 hover:text-primary-600 text-lg font-medium">
              About
            </Link>
            <Link href="/services" className="text-gray-900 hover:text-primary-600 text-lg font-medium">
              Services
            </Link>
            <Link href="/products" className="text-gray-900 hover:text-primary-600 text-lg font-medium">
              Products
            </Link>
            <Link href="/contact" className="text-gray-900 hover:text-primary-600 text-lg font-medium">
              Contact
            </Link>
          </div>

          {/*  Authentication + CartButton + Mobile Menu */}
          <div className="flex items-center space-x-4 ml-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/account" className="text-base text-gray-700 hover:text-primary-600">
                  My Account
                </Link>
                <span className="text-base text-gray-300">|</span>
                <span className="text-base text-gray-700 truncate max-w-[180px]">{user.email}</span>
                <button onClick={handleSignOut} className="btn-outline text-base px-4 py-2">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden md:inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/60"
              >
                <LogIn className="w-4 h-4 opacity-90" />
                <span className="uppercase">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative inline-flex items-center px-4 py-2 rounded-full border hover:bg-gray-50"
            >
              <ShoppingCart className="w-6 h-6 text-gray-800" />
              <span className="ml-2 font-medium">Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-900 hover:text-primary-600 p-2">
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-900 hover:text-primary-600 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-900 hover:text-primary-600 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              href="/services"
              className="block px-3 py-2 text-gray-900 hover:text-primary-600 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Services
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 text-gray-900 hover:text-primary-600 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Products
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-900 hover:text-primary-600 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Contact
            </Link>

            {user ? (
              <div className="px-3 py-2">
                <p className="text-base text-gray-700 mb-2">{user.email}</p>
                <Link
                  href="/account"
                  className="btn-primary text-base w-full block text-center mb-2"
                  onClick={closeMenu}
                >
                  My Account
                </Link>
                <button onClick={handleSignOut} className="btn-outline text-base w-full">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-3 py-2">
                <Link href="/auth" className="btn-primary text-base w-full block text-center" onClick={closeMenu}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
})

export default Navbar
