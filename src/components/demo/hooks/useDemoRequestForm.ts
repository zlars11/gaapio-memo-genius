
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DemoRequestFormData } from "../types/demoRequestTypes";
import { getWebhookUrl, WebhookTypes } from "@/utils/webhookUtils";

export function useDemoRequestForm(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<DemoRequestFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const sendFormsubmitEmail = async (data: DemoRequestFormData) => {
    try {
      const formData = new FormData();
      
      // Add form fields
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('notes', data.notes || '');
      
      // Add Formsubmit configuration
      formData.append('_template', 'table');
      formData.append('_subject', `New Demo Request from ${data.firstName} ${data.lastName}`);
      formData.append('_cc', 'zack@gaapio.com,jace@gaapio.com');
      formData.append('_captcha', 'false');
      
      await fetch('https://formsubmit.co/info@gaapio.com', {
        method: 'POST',
        body: formData
      });
      
      console.log("Formsubmit email sent for demo request");
    } catch (error) {
      console.error("Error sending Formsubmit email:", error);
      // Don't block the main form submission if email fails
    }
  };

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsLoading(true);
    console.log("Form submitted with data:", data);
    
    try {
      // First, trigger Zapier webhook if URL is set
      const webhookUrl = getWebhookUrl(WebhookTypes.DEMO_REQUEST);
      
      if (webhookUrl) {
        console.log("Attempting to trigger Zapier webhook:", webhookUrl);
        
        try {
          // Format data with field names for Zapier
          const zapierData = {
            "Name": `${data.firstName} ${data.lastName}`,
            "Email": data.email,
            "Phone": data.phone,
            "Notes": data.notes || "",
            "Submission Date": new Date().toISOString(),
            "Source": "Demo Request Form"
          };

          console.log("Sending data to Zapier:", zapierData);

          // Use the fetch API to trigger the webhook with better error handling
          const zapierResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors", // Required for cross-origin requests
            body: JSON.stringify(zapierData),
          }).catch(err => {
            console.error("Fetch error:", err);
            throw err;
          });
          
          console.log("Zapier webhook request completed");
          // Cannot check status with mode: "no-cors" but log what we can
          console.log("Response type:", zapierResponse?.type);
        } catch (err) {
          console.error("Error triggering Zapier webhook:", err);
          // Don't throw error here as we still want to save to the database
        }
      } else {
        console.warn("No Zapier webhook URL configured for demo requests");
      }

      console.log("Saving to database...");
      // Then, save to database
      const { error } = await supabase
        .from("demo_requests")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
        });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      // Send Formsubmit email notification
      await sendFormsubmitEmail(data);

      console.log("Demo request saved successfully");
      toast({
        title: "Demo request submitted",
        description: "Thank you for your interest! We'll be in touch soon.",
      });
      
      form.reset();
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
