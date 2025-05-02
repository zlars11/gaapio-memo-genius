
import { useState, useEffect } from "react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function WaitlistSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're in the client environment
    setIsClient(true);
  }, []);
  
  return (
    <section 
      id="waitlist" 
      className="py-20 md:py-32 bg-accent/50"
      aria-labelledby="signup-heading"
    >
      <ResponsiveContainer className="max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <h2 
            id="signup-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Sign Up Now
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Get started with Gaapio and experience the future of accounting memo creation.
          </p>
          <div className="w-full max-w-md">
            {isClient && (
              <div className="flex flex-col items-center">
                <Button size="lg" className="w-full" variant="default" asChild>
                  <Link to="/signup">Sign Up Now</Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
