'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Clock, Settings } from 'lucide-react'

interface UserProfile {
  id: string
  full_name: string
  phone: string
  loyalty_points: number
  dietary_preferences: string[]
}

interface Address {
  id: number
  label: string
  full_address: string
  city: string
  state: string
  is_default: boolean
}

interface Order {
  id: number
  order_number: string
  status: string
  total_amount: number
  created_at: string
  order_items: OrderItem[]
}

interface OrderItem {
  id: number
  product_name: string
  quantity: number
  product_price: number
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [editableFullName, setEditableFullName] = useState('')
  const [editablePhone, setEditablePhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  // Address form state
  const [addressLabel, setAddressLabel] = useState('Home')
  const [addressLine, setAddressLine] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressState, setAddressState] = useState('')
  const [defaultAddressId, setDefaultAddressId] = useState<number | null>(null)
  const [addressSaving, setAddressSaving] = useState(false)
  const [addressMessage, setAddressMessage] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await Promise.all([
          fetchUserProfile(user.id),
          fetchAddresses(user.id),
          fetchOrders(user.id)
        ])
      }
      setLoading(false)
    }

    getUser()
  }, [])

  // When addresses load/update, hydrate the address form from the default address
  useEffect(() => {
    const def = addresses.find((a) => a.is_default) || addresses[0]
    if (def) {
      setDefaultAddressId(def.id)
      setAddressLabel(def.label || 'Home')
      setAddressLine(def.full_address || '')
      setAddressCity(def.city || '')
      setAddressState(def.state || '')
    }
  }, [addresses])

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (data) {
      setProfile(data)
      setEditableFullName(data.full_name || '')
      setEditablePhone(data.phone || '')
    }
  }

  const fetchAddresses = async (userId: string) => {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
    
    if (data) {
      setAddresses(data)
    }
  }

  const fetchOrders = async (userId: string) => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setOrders(data)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleUpdateProfile = async () => {
    try {
      if (!user) return
      setProfileMessage(null)
      setProfileSaving(true)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          full_name: editableFullName,
          phone: editablePhone,
          dietary_preferences: profile?.dietary_preferences || []
        })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to update profile')
      }
      setProfile(result.profile)
      setProfileMessage('Profile updated successfully')
    } catch (error: any) {
      setProfileMessage(error.message || 'Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setPasswordMessage(null)
      if (!newPassword || newPassword.length < 6) {
        setPasswordMessage('Password must be at least 6 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        setPasswordMessage('Passwords do not match')
        return
      }
      setPasswordSaving(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordMessage('Password changed successfully')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setPasswordMessage(error.message || 'Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleSaveAddress = async () => {
    try {
      if (!user) return
      setAddressMessage(null)
      setAddressSaving(true)

      if (defaultAddressId) {
        const { error } = await supabase
          .from('addresses')
          .update({
            label: addressLabel,
            full_address: addressLine,
            city: addressCity,
            state: addressState,
            is_default: true,
          })
          .eq('id', defaultAddressId)
          .eq('user_id', user.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('addresses')
          .insert([
            {
              user_id: user.id,
              label: addressLabel || 'Home',
              full_address: addressLine,
              city: addressCity,
              state: addressState,
              is_default: true,
            },
          ])
        if (error) throw error
      }

      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', defaultAddressId || 0)

      await fetchAddresses(user.id)
      setAddressMessage('Address saved')
    } catch (e: any) {
      setAddressMessage(e.message || 'Failed to save address')
    } finally {
      setAddressSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'preparing': return 'text-blue-600 bg-blue-100'
      case 'ready': return 'text-purple-600 bg-purple-100'
      case 'delivered': return 'text-gray-600 bg-gray-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your account.</p>
          <a href="/auth" className="btn-primary">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.full_name || user.email}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'orders', label: 'Order History', icon: Clock },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Account Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Orders</p>
                      <p className="text-3xl font-bold">{orders.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Account Email</p>
                      <p className="text-3xl font-bold truncate max-w-[16rem]">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">#{order.order_number}</p>
                            <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">Le {order.total_amount.toLocaleString()}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No orders yet. <a href="/products" className="text-primary-600 hover:text-primary-500">Start shopping!</a></p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">#{order.order_number}</h3>
                          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">Le {order.total_amount.toLocaleString()}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items Ordered:</h4>
                        <div className="space-y-2">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.product_name} x {item.quantity}</span>
                              <span>Le {(item.product_price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">Start your first order and we&apos;ll show it here.</p>
                  <a href="/products" className="btn-primary">Browse Products</a>
                </div>
              )}
            </div>
          )}

          

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editableFullName}
                        onChange={(e) => setEditableFullName(e.target.value)}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={editablePhone}
                        onChange={(e) => setEditablePhone(e.target.value)}
                        className="input-field"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-3">
                    <button onClick={handleUpdateProfile} disabled={profileSaving} className="btn-primary">
                      {profileSaving ? 'Updating...' : 'Update Profile'}
                    </button>
                    {profileMessage && (
                      <span className="text-sm text-gray-600">{profileMessage}</span>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Delivery Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                      <input
                        type="text"
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        className="input-field"
                        placeholder="e.g., Home, Work"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="input-field"
                        placeholder="e.g., 16 PLAS George Drive, Leicester Peak"
                        autoComplete="street-address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        className="input-field"
                        placeholder="e.g., Freetown"
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                      <input
                        type="text"
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                        className="input-field"
                        placeholder="e.g., Western Area"
                        autoComplete="address-level1"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-3">
                    <button onClick={handleSaveAddress} disabled={addressSaving} className="btn-primary">
                      {addressSaving ? 'Saving...' : 'Save Address'}
                    </button>
                    {addressMessage && (
                      <span className="text-sm text-gray-600">{addressMessage}</span>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-3">
                    <button onClick={handleChangePassword} disabled={passwordSaving} className="btn-outline">
                      {passwordSaving ? 'Changing...' : 'Change Password'}
                    </button>
                    {passwordMessage && (
                      <span className="text-sm text-gray-600">{passwordMessage}</span>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Session</h3>
                  <button 
                    onClick={handleSignOut}
                    className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
