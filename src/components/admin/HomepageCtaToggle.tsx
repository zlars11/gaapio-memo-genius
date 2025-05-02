
import { useState, useEffect } from "react";

export function HomepageCtaToggle() {
  useEffect(() => {
    // Always set to signup mode
    localStorage.setItem("homepageCta", "signup");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="font-medium">Homepage CTA Button</p>
          <p className="text-sm text-muted-foreground">
            The homepage button is set to "Sign Up Now"
          </p>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Current button text:</p>
        <div className="bg-primary text-primary-foreground rounded px-4 py-2 inline-block">
          Sign Up Now
        </div>
      </div>
    </div>
  );
}
