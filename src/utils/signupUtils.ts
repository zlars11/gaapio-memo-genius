
import { supabase } from "@/integrations/supabase/client";

/**
 * Normalizes a company name (lowercase and trimmed)
 */
export function normalizeCompanyName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Checks if a company exists by name
 */
export async function checkCompanyExists(companyName: string): Promise<{ exists: boolean; id?: string }> {
  const normalizedName = normalizeCompanyName(companyName);
  
  const { data, error } = await supabase
    .from("companies")
    .select("id")
    .ilike("name", normalizedName)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    console.error("Error checking company:", error);
    throw new Error(error.message);
  }
  
  return {
    exists: !!data,
    id: data?.id
  };
}

/**
 * Creates a new company
 */
export async function createCompany(
  companyName: string, 
  plan: 'emerging' | 'mid-market' | 'enterprise' | 'firm' = 'emerging'
): Promise<string> {
  const normalizedName = normalizeCompanyName(companyName);
  
  const { data, error } = await supabase
    .from("companies")
    .insert({
      name: normalizedName,
      plan,
      amount: 0,
      status: "active",
      billing_frequency: "annual"
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error creating company:", error);
    throw new Error(error.message);
  }
  
  return data.id;
}

/**
 * Creates a new user linked to a company
 */
export async function createUser({
  first_name,
  last_name,
  email,
  phone,
  company_id,
  user_type = 'user'
}: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_id: string;
  user_type?: 'user' | 'approver' | 'admin';
}): Promise<string> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      first_name,
      last_name,
      email,
      phone: phone || "",
      company_id,
      user_type,
      status: "active"
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
  
  return data.id;
}

/**
 * Handles the complete signup process in a transaction-like manner
 */
export async function handleSignup({
  first_name,
  last_name,
  company,
  email,
  phone,
  user_type = 'user',
  plan = 'emerging'
}: {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  user_type?: 'user' | 'approver' | 'admin';
  plan?: 'emerging' | 'mid-market' | 'enterprise' | 'firm';
}): Promise<{ success: boolean; company_id?: string; user_id?: string; error?: string }> {
  try {
    // Normalize company name
    const normalizedCompanyName = normalizeCompanyName(company);
    
    // Check if company exists
    const { exists, id: existingCompanyId } = await checkCompanyExists(normalizedCompanyName);
    
    // Get or create company
    let company_id: string;
    if (exists && existingCompanyId) {
      company_id = existingCompanyId;
    } else {
      company_id = await createCompany(normalizedCompanyName, plan);
    }
    
    // Create user
    const user_id = await createUser({
      first_name,
      last_name,
      email,
      phone,
      company_id,
      user_type
    });
    
    return {
      success: true,
      company_id,
      user_id
    };
    
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred during signup"
    };
  }
}
