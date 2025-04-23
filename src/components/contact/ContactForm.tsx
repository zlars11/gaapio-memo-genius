import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/22551110/2xusps1/";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState(""); // Now for "Notes"
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await (supabase as any)
        .from("contact_submissions")
        .insert([
          {
            name,
            email,
            company: company || null,
            message, // Just the "Notes" now
            date: new Date().toISOString(),
          },
        ]);
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          name,
          email,
          company: company || undefined,
          message, // "Notes"
          source: "Contact Form",
          timestamp: new Date().toISOString(),
          destination: "zacklarsen11@gmail.com",
        }),
      });

      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 1 business day."
      });

      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md px-0 sm:px-0 
          flex flex-col items-center 
          bg-transparent border-none shadow-none
        "
        aria-labelledby="contact-form-heading"
      >
        {/* Add the "Firm" heading, styled to match the rest of the site */}
        <div className="w-full mb-4">
          <h2
            id="contact-form-heading"
            className="text-xl sm:text-2xl font-bold text-foreground mb-2 pl-2 pt-1"
          >
            Contact Sales
          </h2>
        </div>
        {/* Card for the actual form */}
        <div className="
            w-full bg-card rounded-lg shadow-md border border-border
            px-5 py-6 sm:px-8 sm:py-8
            flex flex-col gap-5
          "
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
              className="w-full bg-background"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              className="w-full bg-background"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-base font-medium">Company</Label>
            <Input
              id="company"
              placeholder="Your company (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-background"
              autoComplete="organization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
            <Input
              id="phone"
              placeholder="Your phone number"
              value={""}
              readOnly
              className="w-full bg-background"
              autoComplete="tel"
            />
          </div>
          {/* Subject REMOVED */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-base font-medium">Notes</Label>
            <Textarea
              id="message"
              placeholder="Additional notes"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              aria-required="true"
              className="w-full min-h-[120px] bg-background"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-6 text-base mt-2"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            size="lg"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
