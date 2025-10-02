'use client'

import { useState } from 'react'
import { X, CreditCard, Smartphone, Wallet } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
}

interface PaymentModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  amountOverride?: number
}

export default function PaymentModal({ product, isOpen, onClose, amountOverride }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'orangemoney' | 'afrimoney' | 'bankcard' | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const displayAmount = amountOverride ?? product.price

  if (!isOpen) return null

  const handlePayment = async () => {
    if (!selectedMethod) {
      setMessage('Please select a payment method')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      let endpoint = ''
      let payload: any = {
        amount: displayAmount,
        productName: product.name
      }

      switch (selectedMethod) {
        case 'orangemoney':
        case 'afrimoney':
          if (!phoneNumber) {
            setMessage('Please enter your phone number')
            setLoading(false)
            return
          }
          endpoint = `/api/payments/${selectedMethod}`
          payload.phoneNumber = phoneNumber
          break
        case 'bankcard':
          if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
            setMessage('Please fill in all card details')
            setLoading(false)
            return
          }
          endpoint = '/api/payments/bankcard'
          payload = { ...payload, ...cardDetails }
          break
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
        // Close modal after successful payment
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order {product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-2xl font-bold text-primary-600">
                Le {product.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedMethod('orangemoney')}
                className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${
                  selectedMethod === 'orangemoney' 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Smartphone className="w-6 h-6 text-orange-600" />
                <span className="font-medium">OrangeMoney</span>
              </button>

              <button
                onClick={() => setSelectedMethod('afrimoney')}
                className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${
                  selectedMethod === 'afrimoney' 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Wallet className="w-6 h-6 text-blue-600" />
                <span className="font-medium">AfriMoney</span>
              </button>

              <button
                onClick={() => setSelectedMethod('bankcard')}
                className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${
                  selectedMethod === 'bankcard' 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="w-6 h-6 text-gray-600" />
                <span className="font-medium">Bank Card</span>
              </button>
            </div>
          </div>

          {/* Phone Number Input for Mobile Money */}
          {(selectedMethod === 'orangemoney' || selectedMethod === 'afrimoney') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+232 76 123 456"
                className="input-field"
              />
            </div>
          )}

          {/* Card Details Input */}
          {selectedMethod === 'bankcard' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                    placeholder="MM/YY"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    placeholder="123"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.cardholderName}
                  onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a demo implementation. Payment processing is simulated. 
              Real payment integration will be added later.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
