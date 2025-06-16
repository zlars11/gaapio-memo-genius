
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContactForm } from "./hooks/useContactForm";

interface ContactFormProps {
  onSubmitSuccess?: (data: any) => void;
  planType?: string; // Keep for backwards compatibility but not used
}

export function ContactForm({ onSubmitSuccess }: ContactFormProps) {
  const { form, isLoading, onSubmit } = useContactForm(onSubmitSuccess);
  const { register, formState: { errors } } = form;
  
  return (
    <form onSubmit={onSubmit} className="space-y-7">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName"
            placeholder="First name"
            {...register("firstName", { required: "First name is required" })}
            aria-invalid={errors.firstName ? "true" : "false"}
            className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName"
            placeholder="Last name"
            {...register("lastName", { required: "Last name is required" })}
            aria-invalid={errors.lastName ? "true" : "false"}
            className="rounded-lg transition-all focus:border-primary/50 focus:shadow-sm hover:border-primary/30"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
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
        variant="blueOutline"
        className="w-full rounded-lg transition-all duration-300" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
