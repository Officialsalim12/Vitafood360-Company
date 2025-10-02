'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const pageSize = 24

  // Fetch when category or page changes
  useEffect(() => {
    fetchProducts(selectedCategory, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, page])

  const fetchProducts = async (category: string, pageIndex: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(pageIndex * pageSize),
        category,
      })
      const response = await fetch(`/api/products?${params.toString()}`)
      if (response.ok) {
        const data: { items: Product[]; total: number } = await response.json()
        // If page 0 or category changed, replace; otherwise append
        setProducts(prev => (pageIndex === 0 ? data.items : [...prev, ...data.items]))
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'bread', 'cakes', 'snacks', 'pastries']

  const hasMore = products.length < total

  const onSelectCategory = (category: string) => {
    setSelectedCategory(category)
    setPage(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Products
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Fresh, healthy bakery products made with premium ingredients
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setPage(p => p + 1)}
                className="btn-primary"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Categories Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Product Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore our diverse range of healthy bakery products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍞</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bread</h3>
              <p className="text-gray-600">
                Fresh daily bread made with whole grains and natural ingredients
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎂</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cakes</h3>
              <p className="text-gray-600">
                Moist and delicious celebration cakes for special occasions
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Snacks</h3>
              <p className="text-gray-600">
                Healthy snacks and traditional treats for any time of day
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pastries</h3>
              <p className="text-gray-600">
                Flaky pastries and savory pies made with premium ingredients
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
