
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
    const { 
      priceIds, 
      successUrl, 
      cancelUrl, 
      userEmail,
      userId,
      companyId
    } = await req.json()

    // Log request parameters
    console.log('Creating checkout session with price IDs:', priceIds);
    console.log('User data:', { userEmail, userId, companyId });

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
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

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

    // Create or get Stripe customer if email is provided
    let customerId: string | undefined = undefined;
    if (userEmail) {
      try {
        const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          console.log(`Found existing Stripe customer: ${customerId}`);
        } else {
          // Create a new customer
          const newCustomer = await stripe.customers.create({
            email: userEmail,
            metadata: {
              userId: userId || '',
              companyId: companyId || ''
            }
          });
          customerId = newCustomer.id;
          console.log(`Created new Stripe customer: ${customerId}`);
          
          // Update company record with Stripe customer ID
          if (companyId) {
            await supabase
              .from('companies')
              .update({ stripe_customer_id: customerId })
              .eq('id', companyId);
          }
        }
      } catch (stripeError) {
        console.error('Error managing Stripe customer:', stripeError);
        // Continue without customer ID if there's an error
      }
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: !customerId && userEmail ? userEmail : undefined,
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      metadata: {
        userId: userId || '',
        companyId: companyId || ''
      }
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
