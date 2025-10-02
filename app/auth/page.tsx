import { Suspense } from 'react'
import AuthWrapper from '@/components/AuthWrapper'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center">Loading auth...</div>}>
        <AuthWrapper />
      </Suspense>
    </div>
  )
}

