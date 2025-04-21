
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function HomepageCtaToggle() {
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Load saved preference
    const savedPreference = localStorage.getItem("homepageCta");
    setShowSignUp(savedPreference === "signup");
  }, []);

  const handleToggleChange = (checked: boolean) => {
    setShowSignUp(checked);
    localStorage.setItem("homepageCta", checked ? "signup" : "waitlist");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="cta-toggle">Homepage CTA Button</Label>
          <p className="text-sm text-muted-foreground">
            Toggle between "Join the Waitlist" and "Sign Up Now"
          </p>
        </div>
        <div className="ml-4 flex items-center space-x-2">
          <span className={!showSignUp ? "font-medium" : "text-muted-foreground"}>
            Waitlist
          </span>
          <Switch
            id="cta-toggle"
            checked={showSignUp}
            onCheckedChange={handleToggleChange}
          />
          <span className={showSignUp ? "font-medium" : "text-muted-foreground"}>
            Sign Up
          </span>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Current button text:</p>
        <div className="bg-primary text-primary-foreground rounded px-4 py-2 inline-block">
          {showSignUp ? "Sign Up Now" : "Join the Waitlist"}
        </div>
      </div>
    </div>
  );
}
