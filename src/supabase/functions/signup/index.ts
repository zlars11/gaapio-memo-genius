
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestData = await req.json();
    const { first_name, last_name, email, phone, company_name, user_type = "user" } = requestData;

    // Validate required fields
    if (!first_name || !last_name || !email || !company_name) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client using environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Begin transaction-like process
    // 1. Normalize company name
    const normalizedCompanyName = company_name.trim().toLowerCase();

    // 2. Check if company exists
    const { data: existingCompany, error: companyCheckError } = await supabase
      .from("companies")
      .select("id")
      .ilike("name", normalizedCompanyName)
      .single();

    if (companyCheckError && companyCheckError.code !== "PGRST116") {
      throw new Error(`Error checking for existing company: ${companyCheckError.message}`);
    }

    // 3. Create company if it doesn't exist
    let companyId = existingCompany?.id;

    if (!companyId) {
      const { data: newCompany, error: createCompanyError } = await supabase
        .from("companies")
        .insert([
          {
            name: normalizedCompanyName,
            plan: "emerging",
            status: "active",
            amount: 0,
            billing_frequency: "annual",
          },
        ])
        .select("id")
        .single();

      if (createCompanyError) {
        throw new Error(`Error creating company: ${createCompanyError.message}`);
      }

      companyId = newCompany.id;
    }

    // 4. Create the user
    const { data: user, error: createUserError } = await supabase
      .from("users")
      .insert([
        {
          first_name,
          last_name,
          email,
          phone: phone || "",
          company_id: companyId,
          user_type,
          status: "active",
        },
      ])
      .select("id")
      .single();

    if (createUserError) {
      throw new Error(`Error creating user: ${createUserError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: user.id,
        company_id: companyId,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Signup process error:", error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unknown error occurred during signup",
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
