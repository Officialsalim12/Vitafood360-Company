'use client'

import { useSearchParams } from 'next/navigation'
import AuthForm from './AuthForm'

export default function AuthWrapper() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Welcome to Vitafoods360
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'signin'
            ? 'Sign in to your account to continue'
            : 'Create your account to get started'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm mode={mode} />
      </div>
    </>
  )
}
