'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import CustomerDetailsForm, { CustomerDetails } from './CustomerDetailsForm'

interface Product {
  id: number
  name: string
  price: number
}

interface PaymentModalProps {
  product: Product
  quantity?: number
  amountOverride?: number
  isOpen: boolean
  onClose: () => void
}

export default function PaymentModal({ product, quantity = 1, amountOverride, isOpen, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing'>('details')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const displayAmount = (amountOverride ?? (product.price * quantity))

  const handleCustomerSubmit = async (customerDetails: CustomerDetails) => {
    setStep('processing')
    setLoading(true)
    setMessage('')

    try {
      const payload: any = {
        productId: product.id,
        quantity,
        description: product.name,
        customer: customerDetails,
        metadata: {
          productName: product.name,
          productId: product.id,
          customerName: customerDetails.name,
          customerPhone: customerDetails.phone,
          customerAddress: customerDetails.address,
        }
      }

      if (typeof amountOverride === 'number' && amountOverride > 0) {
        payload.amountOverride = amountOverride
      }

      const response = await fetch('/api/monime/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      let data: any
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse response JSON:', jsonError)
        setMessage(`❌ Server error: ${response.status} ${response.statusText}`)
        setLoading(false)
        return
      }

      if (response.ok) {
        const redirectUrl = data?.redirectUrl || data?.url
        if (redirectUrl) {
          // Redirect to Monime hosted checkout
          window.location.href = redirectUrl
          return
        }
        setMessage('❌ No checkout URL received')
      } else {
        console.error('Payment API Error:', data)
        setMessage(`❌ ${data.error || data.message || `Server error: ${response.status}`}`)
      }
    } catch (error) {
      console.error('Payment request failed:', error)
      setMessage(`❌ Network error: ${error instanceof Error ? error.message : 'Please try again'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep('details')
    setMessage('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'details' ? 'Customer Details' : 'Processing...'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
            title="Close"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-2xl font-bold text-primary-600">
              SLE {displayAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {step === 'details' && (
          <CustomerDetailsForm
            onSubmit={handleCustomerSubmit}
            onCancel={handleClose}
            isLoading={loading}
          />
        )}

        {step === 'processing' && loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Preparing your checkout...</p>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
            {message}
            <button
              onClick={handleClose}
              className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
