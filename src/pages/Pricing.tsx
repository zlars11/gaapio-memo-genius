
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  getProductFeatures, 
  calculateTotalPrice,
  getSelectedPriceIds
} from "@/utils/priceUtils";

export default function Pricing() {
  // State for product selection
  const [product, setProduct] = useState<"memos" | "disclosures" | "bundle">("memos");
  const [tier, setTier] = useState<"emerging" | "midMarket" | "enterprise">("midMarket");
  const [addDisclosures, setAddDisclosures] = useState(false);
  const [cpaReviewCount, setCpaReviewCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { toast } = useToast();
  
  // Reset add-ons when product changes
  useEffect(() => {
    if (product === "bundle") {
      setAddDisclosures(false);
    }
  }, [product]);
  
  // Get features based on current selection
  const currentFeatures = getProductFeatures(product, tier);
  
  // Calculate total price
  useEffect(() => {
    const fetchPrice = async () => {
      const price = await calculateTotalPrice(product, tier, addDisclosures, cpaReviewCount);
      setTotalPrice(price);
    };
    
    fetchPrice();
  }, [product, tier, addDisclosures, cpaReviewCount]);
  
  // Handle checkout
  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Get price IDs based on selection
      const priceIds = getSelectedPriceIds(product, tier, addDisclosures, cpaReviewCount);
      
      // Call the create-checkout function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceIds,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Redirect to Stripe checkout URL
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description: error.message || "An error occurred during checkout",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select the product, tier, and add-ons that best fit your organization's needs
            </p>
          </div>
          
          {/* Product Selection */}
          <div className="mb-12 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">1. Select Your Product</h2>
            <RadioGroup 
              className="grid grid-cols-1 md:grid-cols-3 gap-4" 
              defaultValue={product}
              onValueChange={(value) => setProduct(value as "memos" | "disclosures" | "bundle")}
            >
              <div className="border rounded-lg p-4 flex items-start space-x-3 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="memos" id="memos" />
                <div className="space-y-1">
                  <Label htmlFor="memos" className="text-lg font-medium cursor-pointer">Memos</Label>
                  <p className="text-sm text-muted-foreground">
                    AI-generated accounting memos
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 flex items-start space-x-3 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="disclosures" id="disclosures" />
                <div className="space-y-1">
                  <Label htmlFor="disclosures" className="text-lg font-medium cursor-pointer">Disclosures</Label>
                  <p className="text-sm text-muted-foreground">
                    AI-generated financial disclosures
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 flex items-start space-x-3 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="bundle" id="bundle" />
                <div className="space-y-1">
                  <Label htmlFor="bundle" className="text-lg font-medium cursor-pointer">Bundle</Label>
                  <p className="text-sm text-muted-foreground">
                    Both memos and disclosures at a discount
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {/* Tier Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">2. Select Your Tier</h2>
            <Tabs 
              defaultValue={tier}
              className="w-full"
              onValueChange={(value) => setTier(value as "emerging" | "midMarket" | "enterprise")}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="emerging">Emerging</TabsTrigger>
                <TabsTrigger value="midMarket">Mid-Market</TabsTrigger>
                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              </TabsList>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <TabsContent value="emerging">
                  <PricingCard 
                    tier="emerging"
                    product={product}
                    features={currentFeatures}
                    price={totalPrice}
                  />
                </TabsContent>
                <TabsContent value="midMarket">
                  <PricingCard 
                    tier="midMarket"
                    product={product}
                    features={currentFeatures}
                    price={totalPrice}
                    popular={true}
                  />
                </TabsContent>
                <TabsContent value="enterprise">
                  <PricingCard 
                    tier="enterprise"
                    product={product}
                    features={currentFeatures}
                    price={totalPrice}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Add-ons Selection */}
          <div className="mb-12 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">3. Select Add-ons (Optional)</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* CPA Review add-on */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <label htmlFor="cpa-review" className="text-base font-medium">
                        CPA Review
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Add professional CPA review services ($1,000 each)
                      </p>
                    </div>
                    
                    <Select 
                      value={cpaReviewCount.toString()} 
                      onValueChange={(value) => setCpaReviewCount(parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Summary & Checkout */}
          <div className="max-w-3xl mx-auto mb-16">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your plan before subscribing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Product:</span>
                    <span>
                      {product === "memos" && "Memos"}
                      {product === "disclosures" && "Disclosures"}
                      {product === "bundle" && "Memos + Disclosures Bundle"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tier:</span>
                    <span>
                      {tier === "emerging" && "Emerging"}
                      {tier === "midMarket" && "Mid-Market"}
                      {tier === "enterprise" && "Enterprise"}
                    </span>
                  </div>
                  
                  {/* CPA Review */}
                  {cpaReviewCount > 0 && (
                    <div className="flex justify-between">
                      <span className="font-medium">CPA Review:</span>
                      <span>{cpaReviewCount} × $1,000</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${totalPrice}/month</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCheckout} 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Subscribe Now"}
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

// Pricing card component
interface PricingCardProps {
  tier: "emerging" | "midMarket" | "enterprise";
  product: "memos" | "disclosures" | "bundle";
  features: string[];
  price: number;
  popular?: boolean;
}

function PricingCard({ tier, product, features, price, popular }: PricingCardProps) {
  const tierLabels = {
    emerging: "Emerging",
    midMarket: "Mid-Market",
    enterprise: "Enterprise"
  };
  
  return (
    <Card className={`flex flex-col h-full ${popular ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl">
          {tierLabels[tier]}
          {popular && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Popular</span>}
        </CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <CardDescription>
          {tier === "emerging" && "Perfect for growing companies"}
          {tier === "midMarket" && "For established businesses"}
          {tier === "enterprise" && "For large organizations"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
