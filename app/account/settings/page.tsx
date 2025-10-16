'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Address = {
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
}

const STORAGE_KEY = 'vf360_user_address'

export default function SettingsPage() {
  const [address, setAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Address>
        setAddress((prev) => ({ ...prev, ...parsed }))
      }
    } catch {}
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(address))
      }
      await new Promise((r) => setTimeout(r, 300))
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Settings</h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
          Back to Home
        </Link>
      </div>

      {saved && (
        <div
          role="status"
          className="mb-4 rounded-md border border-green-200 bg-green-50 text-green-800 px-4 py-3 text-sm"
        >
          Address updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1
            </label>
            <input
              id="line1"
              name="line1"
              type="text"
              value={address.line1}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoComplete="address-line1"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              id="line2"
              name="line2"
              type="text"
              value={address.line2}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoComplete="address-line2"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={address.city}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoComplete="address-level2"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State/Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={address.state}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoComplete="address-level1"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={address.postalCode}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoComplete="postal-code"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={address.country}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoComplete="country-name"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <span className="text-xs text-gray-500">Your address will be saved to this device.</span>
        </div>
      </form>
    </div>
  )
}
