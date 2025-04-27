
// supabase/functions/signup/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  user_type?: 'user' | 'approver' | 'admin';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get request body
    const requestData: SignupRequest = await req.json();
    
    // Validate required fields
    const { first_name, last_name, email, company_name } = requestData;
    const phone = requestData.phone || '';
    const user_type = requestData.user_type || 'user';
    
    if (!first_name || !last_name || !email || !company_name) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    
    // Normalize company name
    const normalizedCompanyName = company_name.trim().toLowerCase();
    
    let company_id: string;
    let user_id: string;
    
    // Begin database transaction
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if company exists
    const { data: existingCompany, error: companyCheckError } = await supabase
      .from("companies")
      .select("id")
      .ilike("name", normalizedCompanyName)
      .single();
    
    if (companyCheckError && companyCheckError.code !== "PGRST116") {
      throw new Error(`Error checking for company: ${companyCheckError.message}`);
    }
    
    if (existingCompany) {
      // Use existing company
      company_id = existingCompany.id;
      console.log(`Using existing company with ID: ${company_id}`);
    } else {
      // Create new company
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert([{
          name: normalizedCompanyName,
          plan: "emerging", // Default plan
          amount: 0, // Default amount
          status: "active",
          billing_frequency: "annual"
        }])
        .select()
        .single();
      
      if (companyError) {
        throw new Error(`Error creating company: ${companyError.message}`);
      }
      
      company_id = newCompany.id;
      console.log(`Created new company with ID: ${company_id}`);
    }
    
    // Create user linked to company
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([{
        first_name,
        last_name,
        email,
        phone,
        company_id,
        user_type,
        status: "active"
      }])
      .select()
      .single();
    
    if (userError) {
      throw new Error(`Error creating user: ${userError.message}`);
    }
    
    user_id = newUser.id;
    console.log(`Created new user with ID: ${user_id}`);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        user_id,
        company_id
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
    
  } catch (error) {
    console.error("Error in signup function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
