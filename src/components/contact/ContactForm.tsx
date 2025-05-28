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
  planType?: string; // Add a prop to specify the plan type
}

interface ContactFormValues {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactForm({ onSubmitSuccess, planType = "firm" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>();
  
  const sendFormsubmitEmail = async (data: ContactFormValues) => {
    try {
      console.log("Starting Formsubmit email send for contact request with data:", data);
      
      // Create URL-encoded form data for Formsubmit
      const formData = new URLSearchParams();
      
      // Add form fields
      formData.append('firstName', data.first_name);
      formData.append('lastName', data.last_name);
      formData.append('company', data.company);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('message', data.message);
      
      // Add Formsubmit configuration
      formData.append('_template', 'table');
      formData.append('_subject', `New Contact Request from ${data.first_name} ${data.last_name}`);
      formData.append('_cc', 'jace@gaapio.com');
      formData.append('_captcha', 'false');
      
      console.log("Formsubmit payload for contact request:", {
        firstName: data.first_name,
        lastName: data.last_name,
        company: data.company,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        _template: 'table',
        _subject: `New Contact Request from ${data.first_name} ${data.last_name}`,
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
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Clean form data
      const cleanedData = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        company: data.company.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        message: data.message.trim()
      };
      
      // Validate form data
      if (!cleanedData.first_name || !cleanedData.last_name || 
          !cleanedData.company || !cleanedData.email) {
        throw new Error("Please fill in all required fields");
      }
      
      // Begin transaction to create company and user
      const { data: { session } } = await supabase.auth.getSession();
      
      // Normalize company name
      const normalizedCompanyName = cleanedData.company.toLowerCase().trim();
      
      // First check if company exists
      const { data: existingCompany, error: companyCheckError } = await supabase
        .from("companies")
        .select("id")
        .eq("name", normalizedCompanyName)
        .single();

      if (companyCheckError && companyCheckError.code !== 'PGRST116') {
        throw new Error(companyCheckError.message);
      }

      if (existingCompany) {
        toast({
          title: "Company already exists",
          description: "This company is already registered in our system.",
          variant: "destructive"
        });
        return;
      }

      // Create company first - using the planType prop to ensure we use the correct plan value
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([{
          name: normalizedCompanyName,
          plan: planType, // Use the planType prop instead of hardcoding "firm"
          amount: 0,
          status: "active",
          billing_frequency: "annual"
        }])
        .select()
        .single();

      if (companyError) throw companyError;

      // Then create contact submission
      const { error: contactError } = await supabase
        .from("contact_submissions")
        .insert([{
          firstname: cleanedData.first_name,
          lastname: cleanedData.last_name,
          email: cleanedData.email,
          company: normalizedCompanyName,
          phone: cleanedData.phone,
          message: cleanedData.message
        }]);

      if (contactError) throw contactError;

      // Create user record
      const { error: userError } = await supabase
        .from("users")
        .insert([{
          first_name: cleanedData.first_name,
          last_name: cleanedData.last_name,
          email: cleanedData.email,
          phone: cleanedData.phone,
          company_id: companyData.id,
          user_type: "user",
          status: "active"
        }]);

      if (userError) throw userError;

      // Send Formsubmit email notification AFTER successful database saves
      console.log("Database operations successful, now sending Formsubmit email...");
      await sendFormsubmitEmail(cleanedData);
      
      if (onSubmitSuccess) {
        onSubmitSuccess({
          ...cleanedData,
          company_id: companyData.id
        });
      } else {
        toast({
          title: "Message Sent",
          description: "Thank you! We'll be in touch soon.",
        });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label htmlFor="first_name">First Name</Label>
          <Input 
            id="first_name"
            placeholder="First name"
            {...register("first_name", { required: "First name is required" })}
            aria-invalid={errors.first_name ? "true" : "false"}
            className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>
        
        <div className="space-y-2.5">
          <Label htmlFor="last_name">Last Name</Label>
          <Input 
            id="last_name"
            placeholder="Last name"
            {...register("last_name", { required: "Last name is required" })}
            aria-invalid={errors.last_name ? "true" : "false"}
            className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          placeholder="Your company name"
          {...register("company", { required: "Company is required" })}
          aria-invalid={errors.company ? "true" : "false"}
          className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
        />
        {errors.company && (
          <p className="text-sm text-red-500">{errors.company.message}</p>
        )}
      </div>
      
      <div className="space-y-2.5">
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
          className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          {...register("phone", { required: "Phone number is required" })}
          aria-invalid={errors.phone ? "true" : "false"}
          className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="How can we help you?"
          rows={5}
          {...register("message", { required: "Message is required" })}
          aria-invalid={errors.message ? "true" : "false"}
          className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full rounded-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-sm" 
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
