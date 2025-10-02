import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Users, Award, Heart } from 'lucide-react'
import { memo } from 'react'
import dynamic from 'next/dynamic'
import ProductCard from '@/components/ProductCard'

// Lazy load Newsletter component
const Newsletter = dynamic(() => import('@/components/Newsletter'), {
  loading: () => <div className="py-16 bg-primary-600 text-white text-center">Loading...</div>,
  ssr: false
})

// Products data
const featuredProducts = [
  {
    id: 1,
    name: 'Vita Fresh Bread',
    description: 'Freshly baked daily bread with premium ingredients',
    price: 2500,
    image_url: '/images/products/VitaFreshBread.webp',
  },
  {
    id: 2,
    name: 'Vita Rolls',
    description: 'Soft and fluffy dinner rolls perfect for any meal',
    price: 1200,
    image_url: '/images/products/VitaRolls.webp',
  },
  {
    id: 3,
    name: 'Vita Cake',
    description: 'Moist and delicious celebration cakes',
    price: 5000,
    image_url: '/images/products/VitaCakes.webp',
  },
]

const services = [
  {
    icon: <Heart className="w-8 h-8 text-primary-600" />,
    title: 'Healthy Options',
    description: 'We provide nutritious bakery products made with whole grains and natural ingredients.',
  },
  {
    icon: <Award className="w-8 h-8 text-primary-600" />,
    title: 'Quality Assurance',
    description: 'Every product is carefully crafted and tested to meet the highest quality standards.',
  },
  {
    icon: <Users className="w-8 h-8 text-primary-600" />,
    title: 'Community Focus',
    description: 'Supporting local communities through employment and sustainable practices.',
  },
]

// Memoized service component
const ServiceCard = memo(({ service, index }: { service: any, index: number }) => (
  <div className="card text-center">
    <div className="flex justify-center mb-4">
      {service.icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
    <p className="text-gray-600">{service.description}</p>
  </div>
))

ServiceCard.displayName = 'ServiceCard'

// Memoized testimonial component
const TestimonialCard = memo(({ testimonial, index }: { testimonial: any, index: number }) => (
  <div className="card text-center">
    <div className="flex justify-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 mb-4">
      {testimonial.text}
    </p>
    <p className="font-semibold">- {testimonial.author}</p>
  </div>
))

TestimonialCard.displayName = 'TestimonialCard'

const testimonials = [
  {
    text: "The bread is always fresh and delicious. Vitafoods360 has become our go-to bakery for all our family needs.",
    author: "Joy Farma"
  },
  {
    text: "Excellent quality and service. Their whole-wheat bread is perfect for my healthy lifestyle.",
    author: "Emmanuel Mohamed Farma"
  },
  {
    text: "Great variety of products and the staff is always friendly and helpful.",
    author: "Jemimah Pratt"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to Vitafoods360
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Your trusted partner for premium bakery products and nutritional services. 
                We bring you the finest bread, cakes, and healthy food options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-secondary inline-flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/home/VitaHomeScreen.webp"
                alt="Fresh bakery products"
                width={700}
                height={500}
                quality={75}
                className="rounded-lg shadow-2xl"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Vitafoods360?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to providing the highest quality bakery products and nutritional services 
              to help you maintain a healthy lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular bakery items, freshly made daily
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/products" className="btn-primary inline-flex items-center">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}
