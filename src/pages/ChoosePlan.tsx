
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

// Placeholder price IDs - these would come from Stripe in a real implementation
const PRICE_IDS = {
  emerging: "price_emerging_123",
  midMarket: "price_midmarket_456",
  enterprise: "price_enterprise_789"
};

export default function ChoosePlan() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  
  // This is a placeholder - in a real app, you would get this from authentication context
  const companyId = "your_company_id_here";
  
  const handleSubscribe = async (planId: string, priceId: string) => {
    if (!companyId) {
      toast({
        title: "Error",
        description: "You need to be logged in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(planId);
    
    try {
      // In production, this would call the Stripe checkout API endpoint
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          plan_price_id: priceId
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = result.checkout_url;
      } else {
        throw new Error(result.message || "Failed to create checkout session");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };
  
  const plans = [
    {
      id: "emerging",
      name: "Emerging",
      price: "$400",
      description: "Perfect for growing companies",
      features: [
        "Up to 3 users",
        "Unlimited AI-generated memos",
        "Free premium templates",
        "Team collaboration tools"
      ],
      priceId: PRICE_IDS.emerging
    },
    {
      id: "midMarket",
      name: "Mid-Market",
      price: "$700",
      description: "For established businesses",
      features: [
        "Up to 6 users",
        "Unlimited AI-generated memos",
        "Free premium templates",
        "Team collaboration tools",
        "Priority support"
      ],
      priceId: PRICE_IDS.midMarket
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$1,000",
      description: "For large organizations",
      features: [
        "Unlimited users",
        "Unlimited AI-generated memos",
        "Free premium templates",
        "Team collaboration tools",
        "Priority support",
        "Custom integrations",
        "Dedicated account manager"
      ],
      priceId: PRICE_IDS.enterprise
    }
  ];
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <ResponsiveContainer>
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select the plan that best fits your organization's needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map(plan => (
              <Card key={plan.id} className={`flex flex-col h-full ${plan.id === 'midMarket' ? 'border-primary shadow-lg' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {plan.name}
                    {plan.id === 'midMarket' && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Popular</span>}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button 
                    onClick={() => handleSubscribe(plan.id, plan.priceId)}
                    className="w-full" 
                    variant={plan.id === 'midMarket' ? 'default' : 'outline'}
                    disabled={!!loading}
                  >
                    {loading === plan.id ? "Processing..." : "Choose Plan"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
