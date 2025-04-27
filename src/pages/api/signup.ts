
// Note: This file is provided as a template of how to implement a Next.js API route.
// In the current Lovable project structure, this would require configuration changes to work.
// The current project uses Supabase edge functions instead of Next.js API routes.

import { supabase } from "@/integrations/supabase/client";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Method not allowed' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { first_name, last_name, email, phone, company_name, user_type = 'user' } = req.body;

    if (!first_name || !last_name || !email || !company_name) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedCompanyName = company_name.trim().toLowerCase();

    // Check if company exists
    let { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .ilike('name', normalizedCompanyName)
      .single();

    let companyId: string;

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      // Create new company
      const { data: newCompany, error: insertCompanyError } = await supabase
        .from('companies')
        .insert({
          name: company_name.trim(),
          plan: 'emerging',
          amount: 0,
          status: 'active'
        })
        .select()
        .single();

      if (insertCompanyError || !newCompany) {
        throw new Error('Failed to create company: ' + insertCompanyError?.message);
      }

      companyId = newCompany.id;
    }

    // Create user
    const { data: newUser, error: insertUserError } = await supabase
      .from('users')
      .insert({
        first_name,
        last_name,
        email,
        phone,
        company_id: companyId,
        user_type,
        status: 'active'
      })
      .select()
      .single();

    if (insertUserError || !newUser) {
      throw new Error('Failed to create user: ' + insertUserError?.message);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user_id: newUser.id, 
      company_id: companyId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('Signup API Error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      message: err.message || 'Internal Server Error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
