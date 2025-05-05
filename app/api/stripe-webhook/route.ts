// app/api/stripe-webhook/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerId = session.customer as string
    const userId = session.metadata?.userId

    if (userId) {
      await supabase.from('paid_users').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        is_active: true,
        subscribed_at: new Date().toISOString(),
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await supabase
      .from('paid_users')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customerId)
  }

  return new NextResponse('OK', { status: 200 })
}
