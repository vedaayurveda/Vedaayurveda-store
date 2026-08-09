import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCrossSellProducts } from '@/lib/products'

export async function POST(request: Request) {
  const { excludeProductIds } = await request.json()
  const supabase = await createClient()
  const products = await getCrossSellProducts(supabase, excludeProductIds ?? [])
  return NextResponse.json({ products })
}
