
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Success() {
  const location = useLocation();
  
  // Extract session ID from URL if available
  const sessionId = new URLSearchParams(location.search).get("session_id");
  
  // Store session ID in localStorage for future reference
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("stripeSessionId", sessionId);
    }
  }, [sessionId]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer>
          <div className="max-w-lg mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Subscription Successful</CardTitle>
                <CardDescription>
                  Thank you for subscribing to Gaapio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Your subscription has been successfully processed. You now have access to all the features included in your plan.
                </p>
                <p>
                  You will receive an email confirmation with your subscription details shortly.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button asChild>
                  <Link to="/">Return to Home</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
