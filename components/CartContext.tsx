"use client"

import React, { createContext, useContext, useMemo, useState, useCallback } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image_url?: string
  description?: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  updateQty: (id: number, qty: number) => void
  removeItem: (id: number) => void
  clear: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty }
        return next
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }, [])

  const updateQty = useCallback((id: number, qty: number) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)))
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ items, count, total, addItem, updateQty, removeItem, clear, isOpen, openCart, closeCart }),
    [items, count, total, addItem, updateQty, removeItem, clear, isOpen, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
