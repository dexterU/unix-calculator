import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' })
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

const PRICE_IDS: Record<string, string> = {
  developer: process.env.STRIPE_DEVELOPER_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.unixcalculator.com'

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json()

    if (!plan || !email) {
      return NextResponse.json({ error: 'Plan and email required' }, { status: 400 })
    }

    if (plan === 'free') {
      const { data, error } = await getSupabase()
        .from('api_keys')
        .insert({ user_email: email, plan: 'free' })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          const { data: existing } = await getSupabase()
            .from('api_keys')
            .select('api_key')
            .eq('user_email', email)
            .eq('plan', 'free')
            .single()
          return NextResponse.json({ api_key: existing?.api_key })
        }
        return NextResponse.json({ error: 'Failed to create key' }, { status: 500 })
      }

      return NextResponse.json({ api_key: data.api_key })
    }

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/tools/timestamp-api?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/tools/timestamp-api?cancelled=true`,
      metadata: { plan, email },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
