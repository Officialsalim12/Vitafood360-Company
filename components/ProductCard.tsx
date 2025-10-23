'use client'

import { useState, memo, useCallback } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import dynamic from 'next/dynamic'

// Lazy load PaymentModal
const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms))
const retry = <T,>(fn: () => Promise<T>, times = 3, delay = 500): (() => Promise<T>) => {
  return async () => {
    try {
      return await fn()
    } catch (err) {
      if (times <= 0) throw err
      await sleep(delay)
      return retry(fn, times - 1, delay)()
    }
  }
}

const ProductQuickAddModal = dynamic(retry(() => import('./ProductQuickAddModal')), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
}

interface ProductCardProps {
  product: Product
  showPriceAndCart?: boolean
}

const ProductCard = memo(function ProductCard({ product, showPriceAndCart = true }: ProductCardProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleOpenQuickAdd = useCallback(() => {
    setShowQuickAdd(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 mb-4">
          {!imageError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              quality={70}
              className="object-cover rounded-lg"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🍞</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        {showPriceAndCart && (
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              SLE {product.price.toLocaleString()}
            </span>
            <button
              onClick={handleOpenQuickAdd}
              className="btn-primary flex items-center space-x-2"
              aria-label="Add"
              title="Add"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>+</span>
            </button>
          </div>
        )}
      </div>

      {showPriceAndCart && (
        <ProductQuickAddModal
          product={product}
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </>
  )
})

export default ProductCard
