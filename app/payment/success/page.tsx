'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Get session ID from URL parameters
    const id = searchParams.get('session_id') || searchParams.get('id')
    setSessionId(id)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        {sessionId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
            <p className="text-xs font-mono text-gray-800 break-all">{sessionId}</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to you with order details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/products"
              className="flex-1 btn-secondary"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 btn-primary"
            >
              Go to Homepage
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-primary-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
