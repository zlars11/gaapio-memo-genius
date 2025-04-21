
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // This is a placeholder for Stripe integration
  // In a real implementation, this would redirect to a Stripe checkout page
  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccessful(true);
      
      // Record signup in localStorage for admin dashboard metrics
      const existingSignups = JSON.parse(localStorage.getItem("userSignups") || "[]");
      existingSignups.push({
        email: `user${existingSignups.length + 1}@example.com`, // Placeholder
        plan: plan,
        amount: plan === 'monthly' ? '$49.99' : '$499.99',
        date: new Date().toISOString()
      });
      localStorage.setItem("userSignups", JSON.stringify(existingSignups));
      
      toast({
        title: "Payment successful!",
        description: "Thank you for subscribing to Gaapio.",
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28 pb-16">
        <ResponsiveContainer>
          {paymentSuccessful ? (
            <div className="text-center py-12">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We've sent a confirmation email with your account details. You'll be able to access your account shortly.
              </p>
              <Button onClick={() => navigate("/")} size="lg">
                Return to Homepage
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Gaapio</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the plan that works best for you and get started with AI-powered accounting memos today.
                </p>
              </div>
              
              <Tabs defaultValue="monthly" className="max-w-3xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="monthly">Monthly Plan</TabsTrigger>
                  <TabsTrigger value="annual">Annual Plan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly">
                  <PricingCard
                    title="Monthly Subscription"
                    price="$49.99"
                    description="per month, billed monthly"
                    features={[
                      "Unlimited AI-generated memos",
                      "Access to all memo templates",
                      "Priority support",
                      "Continuous updates"
                    ]}
                    ctaText={isLoading ? "Processing..." : "Subscribe Now"}
                    onSubscribe={() => handleSubscribe('monthly')}
                    disabled={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="annual">
                  <PricingCard
                    title="Annual Subscription"
                    price="$499.99"
                    description="per year (save 16%)"
                    features={[
                      "All monthly plan features",
                      "Free premium templates",
                      "Team collaboration tools",
                      "API access"
                    ]}
                    ctaText={isLoading ? "Processing..." : "Subscribe Now"}
                    onSubscribe={() => handleSubscribe('annual')}
                    disabled={isLoading}
                    highlighted={true}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  onSubscribe: () => void;
  disabled: boolean;
  highlighted?: boolean;
}

function PricingCard({
  title,
  price,
  description,
  features,
  ctaText,
  onSubscribe,
  disabled,
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card className={`w-full ${highlighted ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          size="lg" 
          className="w-full" 
          onClick={onSubscribe}
          disabled={disabled}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}
