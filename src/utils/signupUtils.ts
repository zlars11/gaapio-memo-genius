
import { supabase } from "@/integrations/supabase/client";

export async function createFirmSignup(formData: any) {
  try {
    // Clean inputs
    const companyName = formData.company.trim();
    const firstName = (formData.firstName || formData.firstname || "").trim();
    const lastName = (formData.lastName || formData.lastname || "").trim();
    const email = formData.email.trim();
    const phone = formData.phone ? formData.phone.trim() : "";
    
    // Validate inputs
    if (!companyName || !firstName || !lastName || !email) {
      throw new Error("Missing required fields");
    }
    
    // Create the company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        plan: "firm",  // Using "firm" to match the database constraint
        status: "active",
        amount: 0
      })
      .select()
      .single();
      
    if (companyError) throw companyError;
    
    // Then create the user
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      company_id: companyData.id,
      user_type: "user",
      status: "active"
    };
    
    const { error: userError } = await supabase
      .from("users")
      .insert([userData]);
      
    if (userError) throw userError;

    // Queue the webhook
    await triggerZapier({
      ...formData,
      signupDate: new Date().toISOString(),
      type: "firm"
    }, true);
    
    return { success: true, company_id: companyData.id };
  } catch (error: any) {
    console.error("Error in createFirmSignup:", error);
    throw error;
  }
}

export async function handleSignup(formData: any): Promise<{
  success: boolean;
  error?: string;
  company_id?: string;
  user_id?: string;
}> {
  try {
    console.log("Handling signup with data:", formData);
    
    // Clean inputs
    const companyName = formData.company.trim();
    const firstName = (formData.first_name || formData.firstName || "").trim();
    const lastName = (formData.last_name || formData.lastName || "").trim();
    const email = formData.email.trim();
    const phone = formData.phone ? formData.phone.trim() : "";
    
    // Validate inputs
    if (!companyName || !firstName || !lastName || !email) {
      return { success: false, error: "Missing required fields" };
    }
    
    // Make sure plan value matches valid database options
    let dbPlan = formData.plan || "emerging";
    if (dbPlan === "mid") {
      dbPlan = "mid-market";
    } else if (dbPlan === "firms") {
      dbPlan = "firm";  // Changed from "firms" to "firm"
    }
    
    // Create the company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
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
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
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
    
    // Queue webhook - don't await for immediate response
    triggerZapier(formData).catch(err => {
      console.error("Error queuing webhook:", err);
      // Error handled by webhook system, don't block user signup
    });
    
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
  try {
    const webhookUrl = isFirm ? 
      getFirmSignupZapierWebhookUrl() : 
      getUserSignupZapierWebhookUrl();

    if (!webhookUrl) {
      console.warn(`No Zapier webhook URL set for ${isFirm ? 'Firm' : 'User'} Signups`);
      return;
    }
    
    console.log(`Triggering ${isFirm ? 'firm' : 'user'} Zapier webhook:`, webhookUrl);
    
    // Format data
    const payload = isFirm ? {
      "Firm Name": allData.company,
      "Contact Name": `${allData.firstName || allData.firstname} ${allData.lastName || allData.lastname}`,
      "Email": allData.email,
      "Phone": allData.phone,
      "Notes": allData.message || "",
      "Submission Date": new Date().toISOString(),
    } : allData;
    
    // Call the queue-webhook edge function
    const { error } = await supabase.functions.invoke('queue-webhook', {
      body: {
        payload,
        target_url: webhookUrl
      }
    });
    
    if (error) {
      console.error("Error queuing webhook:", error);
      // Don't block the signup process, log error only
    } else {
      console.log("Webhook queued successfully");
    }
  } catch (err) {
    console.error("Error triggering Zapier webhook:", err);
    // Don't block the signup process, log error only
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
