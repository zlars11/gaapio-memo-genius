
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
  first_name: string;
  last_name: string;
  company: string;
  email: string;
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
      // Begin transaction to create company and user
      const { data: { session } } = await supabase.auth.getSession();
      
      // Normalize company name
      const normalizedCompanyName = data.company.toLowerCase().trim();
      
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

      // Create company first
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([{
          name: normalizedCompanyName,
          plan: "firms",
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
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          company: normalizedCompanyName,
          phone: data.phone,
          message: data.message
        }]);

      if (contactError) throw contactError;

      // Create user record
      const { error: userError } = await supabase
        .from("users")
        .insert([{
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          company_id: companyData.id,
          user_type: "user",
          status: "active"
        }]);

      if (userError) throw userError;
      
      if (onSubmitSuccess) {
        onSubmitSuccess({
          ...data,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input 
            id="first_name"
            placeholder="First name"
            {...register("first_name", { required: "First name is required" })}
            aria-invalid={errors.first_name ? "true" : "false"}
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input 
            id="last_name"
            placeholder="Last name"
            {...register("last_name", { required: "Last name is required" })}
            aria-invalid={errors.last_name ? "true" : "false"}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>
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
