
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DemoRequestFormData } from "../types/demoRequestTypes";

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
      console.log("Starting Formsubmit email send for demo request with data:", data);
      
      // Create URL-encoded form data for Formsubmit
      const formData = new URLSearchParams();
      
      // Add form fields
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('notes', data.notes || '');
      
      // Add Formsubmit configuration
      formData.append('_template', 'table');
      formData.append('_subject', `New Demo Request from ${data.firstName} ${data.lastName}`);
      formData.append('_cc', 'jace@gaapio.com');
      formData.append('_captcha', 'false');
      
      console.log("Formsubmit payload for demo request:", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        notes: data.notes || '',
        _template: 'table',
        _subject: `New Demo Request from ${data.firstName} ${data.lastName}`,
        _cc: 'jace@gaapio.com',
        _captcha: 'false'
      });
      
      const response = await fetch('https://formsubmit.co/zack@gaapio.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });
      
      console.log("Formsubmit response status:", response.status);
      console.log("Formsubmit response ok:", response.ok);
      
      if (response.ok) {
        const responseText = await response.text();
        console.log("Formsubmit response text:", responseText);
        console.log("Formsubmit email sent successfully for demo request");
      } else {
        console.error("Formsubmit request failed with status:", response.status);
        const errorText = await response.text();
        console.error("Formsubmit error response:", errorText);
      }
      
    } catch (error) {
      console.error("Error sending Formsubmit email for demo request:", error);
      // Don't block the main form submission if email fails
    }
  };

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsLoading(true);
    console.log("Form submitted with data:", data);
    
    try {
      console.log("Saving to database...");
      // Save to database first
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

      // Send Formsubmit email notification AFTER successful database save
      console.log("Database save successful, now sending Formsubmit email...");
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
