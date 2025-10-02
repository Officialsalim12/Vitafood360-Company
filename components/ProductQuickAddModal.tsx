'use client'

import { useState, useMemo } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useCart } from './CartContext'
import dynamic from 'next/dynamic'

const PaymentModal = dynamic(() => import('./PaymentModal'), { ssr: false })

export interface QuickProduct {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
}

export default function ProductQuickAddModal({
  product,
  isOpen,
  onClose,
}: {
  product: QuickProduct
  isOpen: boolean
  onClose: () => void
}) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [payOpen, setPayOpen] = useState(false)

  const total = useMemo(() => product.price * qty, [product.price, qty])

  if (!isOpen) return null

  const inc = () => setQty(q => Math.min(99, q + 1))
  const dec = () => setQty(q => Math.max(1, q - 1))

  const onAddToCart = () => {
    addItem(
      { id: product.id, name: product.name, price: product.price, description: product.description, image_url: product.image_url },
      qty
    )
    onClose()
  }

  const onCheckout = () => {
    setPayOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <button onClick={onClose} aria-label="Close" title="Close" className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex gap-4">
              {product.image_url ? (
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image src={product.image_url} alt={product.name} fill className="object-cover rounded" />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-3xl">🍞</div>
              )}
              <div className="flex-1">
                <p className="text-gray-700 mb-2 line-clamp-4">{product.description}</p>
                <div className="text-2xl font-bold text-primary-600">Le {product.price.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={dec} aria-label="Decrease quantity" title="Decrease quantity" className="p-2 border rounded hover:bg-gray-50">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={inc} aria-label="Increase quantity" title="Increase quantity" className="p-2 border rounded hover:bg-gray-50">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="text-lg">
                <span className="text-gray-600 mr-2">Total:</span>
                <span className="font-bold">Le {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onAddToCart} className="btn-secondary flex-1">Add to Cart</button>
              <button onClick={onCheckout} className="btn-primary flex-1">Checkout</button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        product={{ id: product.id, name: product.name, price: product.price }}
        amountOverride={total}
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
      />
    </>
  )
}
