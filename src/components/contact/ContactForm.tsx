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
  name: string;
  email: string;
  company?: string;
  phone?: string;
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
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        message: data.message,
      });
      
      if (error) throw new Error(error.message);

      // If an onSubmitSuccess callback was provided (e.g., for firm signups),
      // call it with the form data - but without the message as it's not stored in user_signups
      if (onSubmitSuccess) {
        // Pass data without the message field to ensure it matches user_signups schema
        const firmData = {
          ...data,
          firstname: data.name.split(' ')[0],
          lastname: data.name.split(' ').slice(1).join(' ')
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
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name"
          placeholder="Your name"
          {...register("name", { required: "Name is required" })}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
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
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          placeholder="Your company name"
          {...register("company")}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          {...register("phone")}
        />
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
