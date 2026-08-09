export interface Product {
  id: string
  sku: string
  slug: string
  name: string
  category: string
  short_description: string | null
  base_price: number
  compare_at_price: number | null
  is_featured: boolean
  product_images: { url: string; alt_text: string | null }[]
}

export async function getFeaturedProducts(supabase: any): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, slug, name, category, short_description, base_price, compare_at_price, is_featured, product_images(url, alt_text)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    console.error('Failed to fetch featured products:', error.message)
    return []
  }
  return data ?? []
}

export async function getAllActiveProducts(supabase: any): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, slug, name, category, short_description, base_price, compare_at_price, is_featured, product_images(url, alt_text)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch products:', error.message)
    return []
  }
  return data ?? []
}

export interface ProductVariant {
  id: string
  variant_label: string
  price: number
  compare_at_price: number | null
  stock_quantity: number
  is_active: boolean
  sort_order: number
}

export interface ProductDetail extends Product {
  description: string | null
  ingredients: string | null
  how_to_use: string | null
  benefits: string | null
  stock_quantity: number
  has_variants: boolean
  meta_title: string | null
  meta_description: string | null
  product_variants: ProductVariant[]
}

export async function getProductBySlug(supabase: any, slug: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from('products')
    .select(
      `id, sku, slug, name, category, short_description, description, ingredients, how_to_use,
       benefits, base_price, compare_at_price, stock_quantity, has_variants, is_featured,
       meta_title, meta_description,
       product_images(url, alt_text, sort_order),
       product_variants(id, variant_label, price, compare_at_price, stock_quantity, is_active, sort_order)`
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch product:', error.message)
    return null
  }
  if (!data) return null

  // Sort images and variants for consistent display order
  data.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)
  data.product_variants?.sort((a: any, b: any) => a.sort_order - b.sort_order)

  return data
}

export async function getRelatedProducts(
  supabase: any,
  category: string,
  excludeSlug: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, slug, name, category, short_description, base_price, compare_at_price, is_featured, product_images(url, alt_text)')
    .eq('category', category)
    .eq('is_active', true)
    .neq('slug', excludeSlug)
    .limit(4)

  if (error) {
    console.error('Failed to fetch related products:', error.message)
    return []
  }
  return data ?? []
}

export async function getCrossSellProducts(
  supabase: any,
  excludeProductIds: string[]
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('id, sku, slug, name, category, short_description, base_price, compare_at_price, is_featured, product_images(url, alt_text)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .limit(6)

  if (excludeProductIds.length > 0) {
    query = query.not('id', 'in', `(${excludeProductIds.join(',')})`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch cross-sell products:', error.message)
    return []
  }
  return data ?? []
}
