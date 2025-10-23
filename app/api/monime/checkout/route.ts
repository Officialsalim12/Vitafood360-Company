import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

function toStringMap(input: any): Record<string, string> {
  const out: Record<string, string> = {}
  if (input && typeof input === 'object') {
    for (const [k, v] of Object.entries(input)) {
      if (v === undefined || v === null) continue
      if (typeof v === 'object') continue // drop nested values to satisfy StringMap
      out[k] = String(v)
    }
  }
  return out
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields (server will compute pricing from productId/quantity or amountOverride)
    const { productId, quantity = 1, description, customer, amountOverride } = body

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return NextResponse.json({ error: 'Customer details are required' }, { status: 400 })
    }

    const hasValidProductId = typeof productId === 'number' && productId > 0
    const hasAmountOverride = typeof amountOverride === 'number' && amountOverride > 0

    if (!hasValidProductId && !hasAmountOverride) {
      return NextResponse.json({ error: 'Provide a valid productId or amountOverride' }, { status: 400 })
    }

    if (hasValidProductId && (!quantity || quantity <= 0)) {
      return NextResponse.json({ error: 'quantity must be >= 1' }, { status: 400 })
    }

    // Get Monime credentials from environment (prefer MONIME_ACCESS_TOKEN; support legacy MONIME_API_KEY)
    const apiKey = process.env.MONIME_ACCESS_TOKEN || process.env.MONIME_API_KEY
    const spaceId = process.env.MONIME_SPACE_ID

    if (!apiKey || !spaceId) {
      console.error('Monime credentials not configured')
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Build absolute URLs on the server
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || ''
    const successUrl = `${appUrl.replace(/\/$/, '')}/payment/success`
    const cancelUrl = `${appUrl.replace(/\/$/, '')}/payment/cancel`

    // Prepare Monime API request
    const monimeEndpoint = 'https://api.monime.io/v1/checkout-sessions'

    // Determine item details
    let itemName: string
    let unitMinor: number
    let effectiveQuantity = Number(quantity)
    let product: { id?: number; name?: string; price?: number } | null = null

    if (hasValidProductId) {
      // Fetch product price server-side to prevent client tampering
      const { supabase } = await import('@/lib/supabase')
      const { data: dbProduct, error: productError } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('id', productId)
        .single()

      if (productError || !dbProduct) {
        console.error('Failed to fetch product for checkout', { productId, productError })
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      product = dbProduct
      itemName = dbProduct.name || description || 'Product'
      unitMinor = Math.round(Number(dbProduct.price) * 100)
      effectiveQuantity = Number(quantity)
    } else {
      // Use override amount for cart/adhoc checkout
      itemName = description || 'Cart Checkout'
      unitMinor = Math.round(Number(amountOverride) * 100)
      effectiveQuantity = 1
    }

    // Format phone number - ensure it has country code for Sierra Leone if missing
    let formattedPhone = String(customer.phone || '').trim()
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+232' + formattedPhone.substring(1)
      } else if (!formattedPhone.startsWith('232')) {
        formattedPhone = '+232' + formattedPhone
      } else {
        formattedPhone = '+' + formattedPhone
      }
    }

    // Ensure metadata is a StringMap (all string values)
    const safeMetadata = {
      ...toStringMap(body?.metadata),
      customerName: String(customer.name),
      customerPhone: String(formattedPhone),
      customerAddress: String(customer.address),
      ...(product?.id ? { productId: String(product.id) } : {}),
      productName: String((product?.name ?? description ?? 'Product')),
    }

    const payload = {
      name: (description || product?.name || 'Product Purchase'),
      successUrl,
      cancelUrl,
      lineItems: [
        {
          type: 'custom',
          name: itemName,
          price: { currency: 'SLE', value: unitMinor },
          quantity: effectiveQuantity,
        },
      ],
      metadata: safeMetadata,
    }

    console.log('Creating Monime checkout session:', {
      endpoint: monimeEndpoint,
      payload: {
        ...payload,
        metadata: {
          ...payload.metadata,
          customerPhone: payload.metadata?.customerPhone ? '[REDACTED]' : undefined,
        },
      },
    })

    // Idempotency: allow client-provided key for safe retries, else generate one
    const clientIdemFromHeader = request.headers.get('Idempotency-Key') || request.headers.get('X-Idempotency-Key')
    const clientIdemFromBody = typeof body?.idempotencyKey === 'string' && body.idempotencyKey.trim() ? body.idempotencyKey.trim() : null
    const idempotencyKey = clientIdemFromHeader || clientIdemFromBody || randomUUID()

    // Make request to Monime API
    const response = await fetch(monimeEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Monime-Space-Id': spaceId,
        'Idempotency-Key': idempotencyKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    console.log('Monime API Response:', {
      status: response.status,
      ok: response.ok,
      data,
    })

    if (!response.ok) {
      console.error('Monime API Error:', data)
      return NextResponse.json(
        { error: data?.error?.message || data?.message || 'Failed to create checkout session' },
        { status: response.status }
      )
    }

    // Extract redirect URL from documented response shape
    const redirectUrl = data?.result?.redirectUrl
    const sessionId = data?.result?.id

    if (!redirectUrl) {
      console.error('No redirectUrl in Monime response:', data)
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      redirectUrl,
      sessionId,
      idempotencyKey,
      product: product ? { id: product.id, name: product.name, unitPrice: Number(product.price), quantity: effectiveQuantity } : undefined,
      lineItem: { name: itemName, unitMinor, quantity: effectiveQuantity },
      amountMinor: unitMinor * effectiveQuantity,
    })
  } catch (error: any) {
    console.error('Checkout API Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
