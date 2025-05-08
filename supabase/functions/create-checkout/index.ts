
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { stripe } from "../_shared/stripe.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { getPriceInfo } from "../_shared/prices.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { priceIds, successUrl, cancelUrl } = await req.json()

    // Validate the request
    if (!priceIds || !Array.isArray(priceIds) || priceIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: priceIds must be a non-empty array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: successUrl and cancelUrl are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get price details for each ID
    const lineItems = []
    
    for (const priceId of priceIds) {
      const price = await getPriceInfo(supabase, priceId)
      
      if (!price) {
        return new Response(
          JSON.stringify({ error: `Price ID not found: ${priceId}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      lineItems.push({
        price: priceId,
        quantity: 1,
      })
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
    })

    // Return the checkout URL
    return new Response(
      JSON.stringify({ checkoutUrl: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
