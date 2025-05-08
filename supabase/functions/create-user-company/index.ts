
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Get the request body
    const { firstName, lastName, email, phone, company, tier, product } = await req.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user exists by email
    let userId: string | null = null
    const { data: existingUsers, error: userSearchError } = await supabase
      .from('users')
      .select('id, user_id')
      .eq('email', email)
      .limit(1)

    if (userSearchError) {
      console.error('Error searching for existing user:', userSearchError)
    }

    if (existingUsers && existingUsers.length > 0) {
      // User exists, use existing ID
      userId = existingUsers[0].user_id
      console.log(`User already exists: ${userId}`)
    } else {
      // Create new user record
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          user_type: 'user'
        })
        .select('id, user_id')
        .single()

      if (createUserError) {
        return new Response(
          JSON.stringify({ error: `Failed to create user: ${createUserError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = newUser.user_id
      console.log(`Created new user: ${userId}`)
    }

    // Create company if it doesn't exist
    const { data: newCompany, error: createCompanyError } = await supabase
      .from('companies')
      .insert({
        name: company,
        tier: tier || 'emerging',
        product_type: product || 'memos'
      })
      .select('id')
      .single()

    if (createCompanyError) {
      return new Response(
        JSON.stringify({ error: `Failed to create company: ${createCompanyError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const companyId = newCompany.id
    console.log(`Created company: ${companyId}`)

    // Link user to company
    const { error: linkError } = await supabase
      .from('company_users')
      .insert({
        company_id: companyId,
        user_id: userId,
        role: 'admin'
      })

    if (linkError) {
      return new Response(
        JSON.stringify({ error: `Failed to link user to company: ${linkError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get or create Stripe customer if needed
    // This would be done in a real implementation

    return new Response(
      JSON.stringify({ 
        success: true,
        userId: userId,
        companyId: companyId
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error in create-user-company:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
