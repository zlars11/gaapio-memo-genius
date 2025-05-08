
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

/**
 * Get price information from the database
 */
export async function getPriceInfo(supabase: SupabaseClient, priceId: string) {
  try {
    const { data, error } = await supabase
      .from('product_prices')
      .select('*')
      .eq('stripe_price_id', priceId)
      .single()

    if (error) {
      console.error('Error fetching price info:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception fetching price info:', error)
    return null
  }
}

/**
 * Map our internal price IDs to Stripe price IDs
 */
export async function getStripePriceId(supabase: SupabaseClient, productType: string, tier: string) {
  try {
    const { data, error } = await supabase
      .from('product_prices')
      .select('stripe_price_id')
      .eq('product_type', productType)
      .eq('tier', tier)
      .single()

    if (error) {
      console.error('Error fetching stripe price ID:', error)
      return null
    }

    return data?.stripe_price_id
  } catch (error) {
    console.error('Exception fetching stripe price ID:', error)
    return null
  }
}
