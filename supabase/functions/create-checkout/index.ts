
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getPriceInfo } from '../_shared/prices.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface CreateCheckoutBody {
  priceIds: string[]
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const body: CreateCheckoutBody = await req.json()
    const { priceIds, successUrl, cancelUrl, customerEmail, metadata = {} } = body

    console.log('Creating checkout session with price IDs:', priceIds)
    
    if (!priceIds || !Array.isArray(priceIds) || priceIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid price IDs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Lookup prices from database instead of hardcoding them
    const lineItems = await Promise.all(
      priceIds.map(async (priceId) => {
        const priceInfo = await getPriceInfo(supabase, priceId)
        if (!priceInfo) {
          throw new Error(`Price not found: ${priceId}`)
        }
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: priceInfo.name,
            },
            unit_amount: priceInfo.price * 100, // Convert to cents
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        }
      })
    )

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata,
      allow_promotion_codes: true,
    })

    return new Response(
      JSON.stringify({ checkoutUrl: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
