
import { useState, useEffect } from "react";
import { WaitlistForm } from "@/components/waitlist-form";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function WaitlistSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're in the client environment
    setIsClient(true);
    
    // Check for admin CTA toggle setting
    const ctaSetting = localStorage.getItem("homepageCta");
    setShowSignUp(ctaSetting === "signup");
  }, []);
  
  return (
    <section 
      id="waitlist" 
      className="py-20 md:py-32 bg-accent/50"
      aria-labelledby="waitlist-heading"
    >
      <ResponsiveContainer className="max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <h2 
            id="waitlist-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {isClient && showSignUp ? "Sign Up Now" : "Join the Waitlist Today"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {isClient && showSignUp 
              ? "Get started with Gaapio and experience the future of accounting memo creation." 
              : "Be among the first to experience the future of accounting memo creation. Limited spots available for our beta program."}
          </p>
          <div className="w-full max-w-md">
            {isClient ? (
              showSignUp ? (
                <div className="flex flex-col items-center">
                  <Button size="lg" className="w-full" asChild>
                    <Link to="/signup">Sign Up Now</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              ) : (
                <WaitlistForm />
              )
            ) : (
              <div className="w-full h-[150px] bg-muted/30 animate-pulse rounded-md"></div>
            )}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
