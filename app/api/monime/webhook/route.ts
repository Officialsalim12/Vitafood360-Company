import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Initialize Supabase client (optional - for storing order/payment data)
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  const secret = process.env.MONIME_WEBHOOK_SECRET
  
  if (!secret || !signature) {
    console.warn('Webhook secret or signature missing')
    return false
  }

  try {
    // Compute HMAC SHA256 signature
    const computed = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')
      .toLowerCase()

    const provided = signature.toLowerCase().trim()

    // Constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(computed),
      Buffer.from(provided)
    )
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    // Get signature from headers
    const signature = 
      request.headers.get('monime-signature') || 
      request.headers.get('Monime-Signature') ||
      request.headers.get('x-monime-signature')

    // Get raw body for signature verification
    const payload = await request.text()

    // Verify webhook signature
    const isValid = verifyWebhookSignature(payload, signature)
    
    if (!isValid) {
      console.error('Invalid webhook signature')
      return new NextResponse('Invalid signature', { status: 401 })
    }

    // Parse the event
    const event = JSON.parse(payload)
    
    console.log('Monime webhook event received:', {
      type: event?.type,
      id: event?.data?.id,
      timestamp: new Date().toISOString()
    })

    // Handle different event types
    switch (event?.type) {
      case 'checkout.session.completed':
      case 'payment.succeeded':
        await handlePaymentSuccess(event)
        break

      case 'payment.failed':
        await handlePaymentFailed(event)
        break

      case 'checkout.session.expired':
        await handleSessionExpired(event)
        break

      default:
        console.log('Unhandled event type:', event?.type)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

async function handlePaymentSuccess(event: any) {
  console.log('Payment succeeded:', event?.data)
  
  const data = event?.data
  const metadata = data?.metadata || {}

  // TODO: Update your database with successful payment
  // Example with Supabase:
  if (supabase) {
    try {
      const orderData = {
        payment_id: data?.id,
        payment_status: 'completed',
        amount: data?.amount,
        currency: data?.currency,
        customer_name: metadata?.customerName,
        customer_phone: metadata?.customerPhone,
        customer_address: metadata?.customerAddress,
        product_id: metadata?.productId,
        product_name: metadata?.productName,
        paid_at: new Date().toISOString(),
      }

      // Insert or update order in your database
      // await supabase.from('orders').insert(orderData)
      
      console.log('Order data prepared:', orderData)
    } catch (error) {
      console.error('Error updating database:', error)
    }
  }

  // TODO: Send confirmation email to customer
  // TODO: Trigger order fulfillment process
}

async function handlePaymentFailed(event: any) {
  console.log('Payment failed:', event?.data)
  
  const data = event?.data
  const metadata = data?.metadata || {}

  // TODO: Update your database with failed payment status
  // TODO: Send notification to customer about failed payment
}

async function handleSessionExpired(event: any) {
  console.log('Checkout session expired:', event?.data)
  
  // TODO: Clean up expired sessions in your database if needed
}

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
