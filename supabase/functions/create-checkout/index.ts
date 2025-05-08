// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import Stripe from "https://esm.sh/stripe@14.21.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { priceIds, successUrl, cancelUrl } = await req.json();
    
    if (!priceIds || !Array.isArray(priceIds) || priceIds.length === 0) {
      throw new Error('Invalid price IDs');
    }
    
    // Initialize Stripe client
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the JWT token from the request header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }
    const token = authHeader.replace('Bearer ', '');

    // Get the user from the JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Check if the user already exists as a customer in Stripe
    const { data: customers } = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;

    // If the user exists as a customer in Stripe, use their customer ID
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Otherwise, create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
    }

    // Format line items for Stripe checkout
    const lineItems = priceIds.map(priceId => ({
      price: priceId,
      quantity: 1,
    }));

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: successUrl || `${req.headers.get('origin')}/success`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/cancel`,
      allow_promotion_codes: true,
      metadata: {
        userId: user.id,
      },
    });

    // Return the checkout URL
    return new Response(
      JSON.stringify({ 
        checkoutUrl: session.url,
        sessionId: session.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    // Return error message
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
