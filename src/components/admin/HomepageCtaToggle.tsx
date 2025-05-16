
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function HomepageCtaToggle() {
  const [enableSelfSignup, setEnableSelfSignup] = useState(true);
  
  useEffect(() => {
    // Load the current setting on component mount
    const savedSetting = localStorage.getItem("enableSelfSignup");
    // Default to true if no setting exists
    setEnableSelfSignup(savedSetting !== null ? savedSetting === "true" : true);
  }, []);
  
  const handleToggleChange = (checked: boolean) => {
    setEnableSelfSignup(checked);
    localStorage.setItem("enableSelfSignup", checked.toString());
    // Always ensure homepageCta is set to match the current self-signup setting
    localStorage.setItem("homepageCta", checked ? "signup" : "contact");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="font-medium">Homepage CTA Button</p>
          <p className="text-sm text-muted-foreground">
            {enableSelfSignup 
              ? "The secondary homepage button is set to \"Sign Up Now\""
              : "The secondary homepage button is set to \"Contact Sales\""}
          </p>
        </div>
        <Switch 
          id="enable-self-signup" 
          checked={enableSelfSignup}
          onCheckedChange={handleToggleChange}
        />
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Current button text:</p>
        <div className="bg-primary text-primary-foreground rounded px-4 py-2 inline-block">
          {enableSelfSignup ? "Sign Up Now" : "Contact Sales"}
        </div>
      </div>
    </div>
  );
}
