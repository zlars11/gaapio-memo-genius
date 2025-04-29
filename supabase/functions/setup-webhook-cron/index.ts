
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// This function will set up a cron job to process webhooks every 5 minutes
// It can be run once manually to set up the cron job

const CRON_SCHEDULE = '*/5 * * * *' // Every 5 minutes

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get supabase client (admin)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create SQL to set up the cron job
    const functionUrl = `${supabaseUrl}/functions/v1/process-webhooks`
    const annonKey = Deno.env.get('SUPABASE_ANON_KEY') as string

    // First make sure pg_cron and pg_net extensions are installed
    await supabase.rpc('install_available_extensions_and_test')

    // Check if the job already exists
    const { data: existingJob, error: checkError } = await supabase.rpc('get_cron_job', {
      job_name: 'process-webhooks-cron'
    })

    if (checkError) {
      console.error('Error checking for existing cron job:', checkError)
      // Continue and try to create the job anyway
    }

    let result

    if (existingJob && existingJob.length > 0) {
      // Update existing job
      const { data, error } = await supabase.rpc('update_cron_job', {
        job_name: 'process-webhooks-cron',
        schedule: CRON_SCHEDULE,
        command: `
          select
            net.http_post(
              url:='${functionUrl}',
              headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${annonKey}"}'::jsonb,
              body:='{}'::jsonb
            ) as request_id;
        `
      })

      if (error) throw error
      result = { message: 'Cron job updated', data }
    } else {
      // Create new job
      const { data, error } = await supabase.rpc('create_cron_job', {
        job_name: 'process-webhooks-cron',
        schedule: CRON_SCHEDULE,
        command: `
          select
            net.http_post(
              url:='${functionUrl}',
              headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${annonKey}"}'::jsonb,
              body:='{}'::jsonb
            ) as request_id;
        `
      })

      if (error) throw error
      result = { message: 'Cron job created', data }
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error setting up cron job:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
