
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ContactFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

interface ContactFormProps {
  onSubmitSuccess?: (data: ContactFormFields) => void;
}

export function ContactForm({ onSubmitSuccess }: ContactFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormFields>();

  const onSubmit = async (data: ContactFormFields) => {
    setIsSubmitting(true);

    try {
      // Save to Supabase
      await supabase.from("contact_submissions").insert([
        {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          company: data.company,
          message: data.message
        }
      ]);

      // Show success message
      toast({
        title: "Message sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      // Reset form
      reset();

      // Call the onSubmitSuccess callback if provided
      if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
        onSubmitSuccess(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            id="firstName"
            placeholder="First name"
            {...register("firstName", { required: true })}
          />
          {errors.firstName && <p className="text-xs text-destructive">First name is required</p>}
        </div>
        <div className="space-y-2">
          <Input
            id="lastName"
            placeholder="Last name"
            {...register("lastName", { required: true })}
          />
          {errors.lastName && <p className="text-xs text-destructive">Last name is required</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          placeholder="Your email"
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-xs text-destructive">Email is required</p>}
      </div>
      <div className="space-y-2">
        <Input
          id="phone"
          type="tel"
          placeholder="Phone number"
          {...register("phone")}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="company"
          placeholder="Company"
          {...register("company")}
        />
      </div>
      <div className="space-y-2">
        <Textarea
          id="message"
          placeholder="How can we help?"
          className="min-h-[120px]"
          {...register("message", { required: true })}
        />
        {errors.message && <p className="text-xs text-destructive">Message is required</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
