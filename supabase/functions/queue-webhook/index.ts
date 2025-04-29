
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Parse request body
    const { payload, target_url } = await req.json()

    // Validate request
    if (!payload || !target_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: payload or target_url' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert webhook into outbox
    const { data, error } = await supabase
      .from('webhook_outbox')
      .insert([
        {
          payload,
          target_url,
          status: 'pending',
        },
      ])
      .select()

    if (error) {
      console.error('Error inserting webhook:', error)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to queue webhook' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Try immediate delivery
    try {
      const response = await fetch(target_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      // If successful, update status to success
      if (response.ok || response.status === 0) { // Status 0 can happen with no-cors responses
        await supabase
          .from('webhook_outbox')
          .update({ status: 'success' })
          .eq('id', data[0].id)
      }
    } catch (deliveryError) {
      // If immediate delivery fails, that's fine - the webhook will be processed by the background job
      console.warn('Immediate delivery failed, will retry in background:', deliveryError)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook queued successfully', id: data[0].id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in queue-webhook function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
