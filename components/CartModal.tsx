'use client'

import { useCart } from './CartContext'
import Image from 'next/image'
import { X, Plus, Minus } from 'lucide-react'
import PaymentModal from './PaymentModal'
import { useState } from 'react'

export default function CartModal() {
  const { items, total, isOpen, closeCart, updateQty, removeItem, clear } = useCart()
  const [payOpen, setPayOpen] = useState(false)

  const hasItems = items.length > 0

  const onCheckout = () => {
    if (!hasItems) return
    setPayOpen(true)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeCart} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">Your Cart</h3>
              <button onClick={closeCart} className="text-gray-500 hover:text-gray-700" aria-label="Close cart" title="Close cart">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {!hasItems ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 border rounded-lg p-3">
                    {item.image_url ? (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover rounded" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">🍞</div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
                      <div className="mt-1 text-primary-600 font-semibold">Le {item.price.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-2 border rounded hover:bg-gray-50" aria-label="Decrease quantity" title="Decrease quantity"><Minus className="w-4 h-4"/></button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-2 border rounded hover:bg-gray-50" aria-label="Increase quantity" title="Increase quantity"><Plus className="w-4 h-4"/></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="ml-2 text-sm text-red-600 hover:underline">Remove</button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-lg font-bold">Le {total.toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={clear} disabled={!hasItems} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">Clear</button>
                <button onClick={onCheckout} disabled={!hasItems} className="btn-primary disabled:opacity-50">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment modal using cart total as amount */}
      <PaymentModal
        product={{ id: 0, name: 'Cart Checkout', price: total }}
        amountOverride={total}
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
      />
    </>
  )
}
