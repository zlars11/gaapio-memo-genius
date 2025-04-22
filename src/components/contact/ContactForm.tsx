
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_CONTACT_WEBHOOK_ID/"; // Replace with your Zapier URL if needed

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to localStorage
      const contactSubmissions = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
      const submission = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
        name,
        email,
        message,
        date: new Date().toISOString(),
      };
      contactSubmissions.push(submission);
      localStorage.setItem("contactSubmissions", JSON.stringify(contactSubmissions));

      // Send to Zapier
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          name,
          email,
          message,
          source: "Contact Form",
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We will get back to you soon.",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          disabled={isLoading}
        />
      </div>
      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
