
import { supabase } from "@/integrations/supabase/client";

export async function createFirmSignup(formData: any) {
  // Create the company
  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: formData.company,
      plan: "firm",  // Updated from "firms" to match the constraint
      status: "active",
      amount: 0
    })
    .select()
    .single();
    
  if (companyError) throw companyError;
  
  // Then create the user
  const userData = {
    first_name: formData.firstName || formData.firstname || "", 
    last_name: formData.lastName || formData.lastname || "",    
    email: formData.email,
    phone: formData.phone,
    company_id: companyData.id,
    user_type: "user",
    status: "active"
  };
  
  const { error: userError } = await supabase
    .from("users")
    .insert([userData]);
    
  if (userError) throw userError;
}

export async function handleSignup(formData: any): Promise<{
  success: boolean;
  error?: string;
  company_id?: string;
  user_id?: string;
}> {
  try {
    console.log("Handling signup with data:", formData);
    
    // Make sure plan value matches valid database options
    let dbPlan = formData.plan || "emerging";
    if (dbPlan === "mid") {
      dbPlan = "mid-market";
    } else if (dbPlan === "firms") {
      dbPlan = "firm";
    }
    
    // Create the company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: formData.company,
        plan: dbPlan,
        status: "active",
        amount: formData.amount || 0,
        billing_frequency: formData.term || "annual",
      })
      .select()
      .single();
      
    if (companyError) {
      console.error("Company creation error:", companyError);
      return { success: false, error: companyError.message };
    }
    
    // Then create the user
    const userData = {
      first_name: formData.first_name || formData.firstName || "",
      last_name: formData.last_name || formData.lastName || "",
      email: formData.email,
      phone: formData.phone || "",
      company_id: companyData.id,
      user_type: formData.user_type || "user",
      status: "active"
    };
    
    const { data: userResult, error: userError } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();
    
    if (userError) {
      console.error("User creation error:", userError);
      return { success: false, error: userError.message };
    }
    
    return { 
      success: true, 
      company_id: companyData.id, 
      user_id: userResult.id 
    };
    
  } catch (err: any) {
    console.error("Signup error:", err);
    return { 
      success: false, 
      error: err.message || "An unexpected error occurred during signup"
    };
  }
}

export async function triggerZapier(allData: any, isFirm: boolean = false) {
  const ZAPIER_WEBHOOK_URL = isFirm ? 
    getFirmSignupZapierWebhookUrl() : 
    getUserSignupZapierWebhookUrl();

  if (!ZAPIER_WEBHOOK_URL) {
    throw new Error(`No Zapier webhook URL set for ${isFirm ? 'Firm' : 'User'} Signups`);
  }
  
  try {
    console.log(`Triggering ${isFirm ? 'firm' : 'user'} Zapier webhook:`, ZAPIER_WEBHOOK_URL);
    
    const formattedData = isFirm ? {
      "Firm Name": allData.company,
      "Contact Name": `${allData.firstName || allData.firstname} ${allData.lastName || allData.lastname}`,
      "Email": allData.email,
      "Phone": allData.phone,
      "Notes": allData.message || "",
      "Submission Date": new Date().toISOString(),
    } : allData;
    
    await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(formattedData),
    });
    console.log("Zapier webhook triggered successfully");
  } catch (err) {
    console.error("Error triggering Zapier webhook:", err);
  }
}

export function getUserSignupZapierWebhookUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userSignupWebhookUrl") || "";
  }
  return "";
}

export function getFirmSignupZapierWebhookUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("firmSignupWebhookUrl") || "";
  }
  return "";
}
