
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

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsLoading(true);
    console.log("Form submitted with data:", data);
    
    try {
      console.log("Saving to database...");
      // First, save to database
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

      console.log("Demo request saved successfully");
      
      // Then, trigger Zapier webhook if URL is set
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

          // Use the fetch API to trigger the webhook
          await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(zapierData),
          });
          
          console.log("Zapier webhook triggered successfully");
        } catch (err) {
          console.error("Error triggering Zapier webhook:", err);
          // Don't throw error here as we still want to show success to the user
        }
      } else {
        console.warn("No Zapier webhook URL configured for demo requests");
      }

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
