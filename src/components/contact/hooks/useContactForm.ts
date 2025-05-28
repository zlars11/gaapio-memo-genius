
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

export function useContactForm(onSuccess?: (data: any) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const sendFormsubmitEmail = async (data: ContactFormData) => {
    try {
      console.log("Starting Formsubmit email send for contact request with data:", data);
      
      // Create URL-encoded form data for Formsubmit
      const formData = new URLSearchParams();
      
      // Add form fields
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('company', data.company);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('message', data.message);
      
      // Add Formsubmit configuration
      formData.append('_template', 'table');
      formData.append('_subject', `New Contact Request from ${data.firstName} ${data.lastName}`);
      formData.append('_cc', 'jace@gaapio.com');
      formData.append('_captcha', 'false');
      
      console.log("Formsubmit payload for contact request:", {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        _template: 'table',
        _subject: `New Contact Request from ${data.firstName} ${data.lastName}`,
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
        console.log("Formsubmit email sent successfully for contact request");
      } else {
        console.error("Formsubmit request failed with status:", response.status);
        const errorText = await response.text();
        console.error("Formsubmit error response:", errorText);
      }
      
    } catch (error) {
      console.error("Error sending Formsubmit email for contact request:", error);
      // Don't block the main form submission if email fails
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    console.log("Contact form submitted with data:", data);
    
    try {
      console.log("Saving to database...");
      // Save to database - simple insert like demo requests
      const { error } = await supabase
        .from("contact_submissions")
        .insert({
          firstname: data.firstName,
          lastname: data.lastName,
          email: data.email,
          company: data.company,
          phone: data.phone,
          message: data.message,
        });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      // Send Formsubmit email notification AFTER successful database save
      console.log("Database save successful, now sending Formsubmit email...");
      await sendFormsubmitEmail(data);

      console.log("Contact request saved successfully");
      toast({
        title: "Message sent",
        description: "Thank you for your message! We'll be in touch soon.",
      });
      
      form.reset();
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
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
