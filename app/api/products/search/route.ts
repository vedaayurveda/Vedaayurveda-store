import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  const supabase = await createClient()
  // Strip characters that have special meaning in PostgREST's .or() filter syntax
  // (commas separate conditions, parentheses group them) so user input can't
  // break or manipulate the query structure.
  const safeQ = q.replace(/[,()]/g, '')
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, slug, name, category, short_description, base_price, compare_at_price, is_featured, product_images(url, alt_text)')
    .eq('is_active', true)
    .or(`name.ilike.%${safeQ}%,category.ilike.%${safeQ}%,short_description.ilike.%${safeQ}%`)
    .limit(12)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data ?? [] })
}
