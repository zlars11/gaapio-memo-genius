
import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/22551110/2xusps1/";

export const WaitlistForm = memo(function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Submit to Supabase table (waitlist_submissions)
      await (supabase as any)
        .from("waitlist_submissions")
        .insert([
          {
            email,
            name,
            company,
            date: new Date().toISOString(),
          },
        ]);

      // Format data with exact field names for Zapier
      const zapierData = {
        "Email": email,
        "Name": name,
        "Company": company,
        "Source": "Waitlist Form",
        "Submission Date": new Date().toISOString(),
        "Destination": "zacklarsen11@gmail.com",
      };

      // Send to Zapier with formatted field names
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(zapierData),
      });

      toast({
        title: "You're on the list!",
        description: "Thanks for joining our waitlist. We'll be in touch soon.",
      });

      setEmail("");
      setName("");
      setCompany("");
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
          disabled={isLoading}
        />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={isLoading}
        />
        <Input
          type="text"
          placeholder="Your company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Joining..." : "Join Waitlist"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
});
