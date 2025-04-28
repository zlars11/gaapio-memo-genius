
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DemoRequestFormData } from "../types/demoRequestTypes";

export function useDemoRequestForm() {
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

  const getDemoWebhookUrl = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("demoRequestWebhookUrl") || "";
    }
    return "";
  };

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsLoading(true);
    try {
      // First, trigger Zapier webhook if URL is set
      const webhookUrl = getDemoWebhookUrl();
      
      if (webhookUrl) {
        try {
          console.log("Triggering Zapier webhook for demo request:", webhookUrl);
          
          // Format data with field names for Zapier
          const zapierData = {
            "Name": `${data.firstName} ${data.lastName}`,
            "Email": data.email,
            "Phone": data.phone,
            "Notes": data.notes || "",
            "Submission Date": new Date().toISOString(),
            "Source": "Demo Request Form"
          };

          // Use the fetch API to trigger the webhook
          const zapierResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors",
            body: JSON.stringify(zapierData),
          });
          
          console.log("Zapier webhook triggered with response:", zapierResponse);
        } catch (err) {
          console.error("Error triggering Zapier webhook:", err);
          // Don't throw error here as we still want to save to the database
        }
      } else {
        console.log("No Zapier webhook URL configured for demo requests");
      }

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

      if (error) throw error;

      toast({
        title: "Demo request submitted",
        description: "Thank you for your interest! We'll be in touch soon.",
      });
      
      form.reset();
    } catch (error: any) {
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
