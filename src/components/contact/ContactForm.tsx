
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  onSubmitSuccess?: (data: any) => void;
}

interface ContactFormValues {
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

export function ContactForm({ onSubmitSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>();
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Store in Supabase contact_submissions table
      const { error } = await supabase.from("contact_submissions").insert({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        company: data.company,
        phone: data.phone,
        message: data.message,
      });
      
      if (error) throw new Error(error.message);

      // If an onSubmitSuccess callback was provided (e.g., for firm signups),
      // call it with the form data with preserved firstname and lastname fields
      if (onSubmitSuccess) {
        // Format data for Zapier with exact field names matching the email template
        const firmData = {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone,
          company: data.company,
          message: data.message,
          // Additional fields for Zapier formatting
          "Firm Name": data.company,
          "Contact Name": `${data.firstname} ${data.lastname}`,
          "Email": data.email,
          "Phone": data.phone,
          "Notes": data.message,
          "Submission Date": new Date().toISOString(),
        };
        onSubmitSuccess(firmData);
      } else {
        // Show success message
        toast({
          title: "Message Sent",
          description: "Thank you! We'll be in touch soon.",
        });
        
        // Reset form
        reset();
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstname">First Name</Label>
          <Input 
            id="firstname"
            placeholder="First name"
            {...register("firstname", { required: "First name is required" })}
            aria-invalid={errors.firstname ? "true" : "false"}
          />
          {errors.firstname && (
            <p className="text-sm text-red-500">{errors.firstname.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastname">Last Name</Label>
          <Input 
            id="lastname"
            placeholder="Last name"
            {...register("lastname", { required: "Last name is required" })}
            aria-invalid={errors.lastname ? "true" : "false"}
          />
          {errors.lastname && (
            <p className="text-sm text-red-500">{errors.lastname.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Your email address"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          placeholder="Your company name"
          {...register("company", { required: "Company is required" })}
          aria-invalid={errors.company ? "true" : "false"}
        />
        {errors.company && (
          <p className="text-sm text-red-500">{errors.company.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          {...register("phone", { required: "Phone number is required" })}
          aria-invalid={errors.phone ? "true" : "false"}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="How can we help you?"
          rows={5}
          {...register("message", { required: "Message is required" })}
          aria-invalid={errors.message ? "true" : "false"}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
