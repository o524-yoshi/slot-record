// ✅ app/api/create-checkout-session/route.ts

export const runtime = 'nodejs'

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

// ✅ Stripe インスタンス初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil', // Stripeダッシュボードのバージョンと一致
})

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return new NextResponse('userId is required', { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // Stripeのダッシュボードで作成した価格ID
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?user=${userId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: { userId },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('❌ Stripe checkout session creation failed:', error)
    return new NextResponse('Failed to create session', { status: 500 })
  }
}
