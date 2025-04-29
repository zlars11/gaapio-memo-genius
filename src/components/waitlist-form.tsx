
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
      // Clean form data
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();
      const trimmedCompany = company.trim();
      
      // Validate form data
      if (!trimmedEmail || !trimmedName) {
        toast({
          title: "Missing information",
          description: "Please provide your name and email.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Submit to Supabase table (waitlist_submissions)
      await supabase
        .from("waitlist_submissions")
        .insert([
          {
            email: trimmedEmail,
            name: trimmedName,
            company: trimmedCompany,
            date: new Date().toISOString(),
          },
        ]);

      // Format data with exact field names for Zapier
      const zapierData = {
        "Email": trimmedEmail,
        "Name": trimmedName,
        "Company": trimmedCompany,
        "Source": "Waitlist Form",
        "Submission Date": new Date().toISOString(),
        "Destination": "zacklarsen11@gmail.com",
      };

      // Queue webhook via edge function
      await supabase.functions.invoke('queue-webhook', {
        body: {
          payload: zapierData,
          target_url: ZAPIER_WEBHOOK_URL
        }
      }).catch(err => {
        console.error("Error queuing webhook:", err);
        // Don't block the form submission if the webhook fails
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
