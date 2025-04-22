
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
      // Send to Supabase
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
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS issues
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

      // Reset form
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
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto px-4 sm:px-0" aria-labelledby="contact-form-heading">
      <h2 id="contact-form-heading" className="sr-only">Contact Form</h2>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">Name</Label>
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
        <Label htmlFor="email" className="text-base">Email</Label>
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
        <Label htmlFor="company" className="text-base">Company</Label>
        <Input
          id="company"
          placeholder="Your company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-base">Subject</Label>
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
        <Label htmlFor="message" className="text-base">Message</Label>
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
