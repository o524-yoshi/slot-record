// app/api/check-user/route.ts

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ isActive: false, error: 'No userId provided' }, { status: 400 })
  }

  const SUPABASE_URL = process.env.SUPABASE_URL!
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/paid_users?user_id=eq.${userId}&select=is_active`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )

  const data = await res.json()

  const isActive = Array.isArray(data) && data.length > 0 && data[0].is_active === true

  return NextResponse.json({ isActive })
}
