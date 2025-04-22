
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
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
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
            message: subject ? `[${subject}] ${message}` : message,
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
          subject,
          message,
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
      setSubject("");
      setMessage("");
      setCompany("");
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
    <form
      onSubmit={handleSubmit}
      className="space-y-5 w-full max-w-md mx-auto px-4 sm:px-0 bg-white rounded-lg shadow-md border border-muted"
      aria-labelledby="contact-form-heading"
    >
      {/* REMOVE extra "Contact Sales" heading, handled in Firm card now */}
      {/* <h2 id="contact-form-heading" className="text-2xl font-extrabold mb-2">Contact Sales</h2> */}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-base text-neutral-900 font-medium">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base text-neutral-900 font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company" className="text-base text-neutral-900 font-medium">Company</Label>
        <Input
          id="company"
          placeholder="Your company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base text-neutral-900 font-medium">Phone</Label>
        <Input
          id="phone"
          placeholder="Your phone number"
          value={""}
          readOnly
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-base text-neutral-900 font-medium">Subject</Label>
        <Input
          id="subject"
          placeholder="What's this about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          aria-required="true"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-base text-neutral-900 font-medium">Message</Label>
        <Textarea
          id="message"
          placeholder="Your message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          aria-required="true"
          className="w-full min-h-[120px]"
        />
      </div>
      <Button
        type="submit"
        className="w-full py-6 text-base"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        size="lg"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
