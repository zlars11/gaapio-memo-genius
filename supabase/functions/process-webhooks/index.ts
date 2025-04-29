
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookRecord {
  id: string
  payload: Record<string, any>
  target_url: string
  status: string
  retry_count: number
  error_message: string | null
  created_at: string
  updated_at: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let webhooks: WebhookRecord[] = []

    // Get pending webhooks (status = 'pending' OR (status = 'failed' AND retry_count < 3))
    const { data, error } = await supabase
      .from('webhook_outbox')
      .select('*')
      .or(`status.eq.pending,and(status.eq.failed,retry_count.lt.3)`)
      .order('created_at', { ascending: true })
      .limit(10)

    if (error) {
      console.error('Error fetching webhooks:', error)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch webhooks' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    webhooks = data as WebhookRecord[]
    console.log(`Processing ${webhooks.length} webhooks`)

    if (webhooks.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No webhooks to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process webhooks
    const results = await Promise.all(
      webhooks.map(async (webhook) => {
        try {
          console.log(`Processing webhook ${webhook.id} to ${webhook.target_url}`)
          
          // Send webhook
          const response = await fetch(webhook.target_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhook.payload),
          })

          // Check response
          if (response.ok || response.status === 0) { // Status 0 can happen with no-cors responses
            // Update webhook status to success
            await supabase
              .from('webhook_outbox')
              .update({
                status: 'success',
              })
              .eq('id', webhook.id)

            return { id: webhook.id, success: true }
          } else {
            const responseText = await response.text()
            throw new Error(`HTTP error ${response.status}: ${responseText}`)
          }
        } catch (error) {
          console.error(`Error processing webhook ${webhook.id}:`, error)
          
          // Update webhook status to failed and increment retry count
          await supabase
            .from('webhook_outbox')
            .update({
              status: 'failed',
              retry_count: webhook.retry_count + 1,
              error_message: error.message,
            })
            .eq('id', webhook.id)

          return { id: webhook.id, success: false, error: error.message }
        }
      })
    )

    // Check for webhooks that failed 3 times
    const failedWebhooks = results.filter(r => !r.success)
    if (failedWebhooks.length > 0) {
      console.warn(`${failedWebhooks.length} webhooks failed processing`)
    }

    return new Response(
      JSON.stringify({ success: true, processed: webhooks.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in process-webhooks function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
