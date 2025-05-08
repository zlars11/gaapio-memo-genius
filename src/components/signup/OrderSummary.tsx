
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

interface OrderSummaryProps {
  selectedTier: string;
  selectedProduct: string;
  addDisclosures: boolean;
  cpaReviewCount: number;
  isLoading: boolean;
  onSubscribe: () => void;
}

export function OrderSummary({
  selectedTier,
  selectedProduct,
  addDisclosures,
  cpaReviewCount,
  isLoading,
  onSubscribe
}: OrderSummaryProps) {
  // Tier pricing
  const getTierBasePrice = () => {
    switch (selectedTier) {
      case "enterprise": return 1000;
      case "mid": return 700;
      default: return 400; // emerging
    }
  };

  // Get tier display name
  const getTierName = () => {
    switch (selectedTier) {
      case "enterprise": return "Enterprise";
      case "mid": return "Mid-Market";
      default: return "Emerging";
    }
  };

  // Get product display name
  const getProductName = () => {
    switch (selectedProduct) {
      case "disclosures": return "Disclosures";
      case "bundle": return "Memos + Disclosures Bundle";
      default: return "Memos";
    }
  };

  // Calculate total
  const calculateTotal = () => {
    let total = getTierBasePrice();
    
    // If memos with disclosures add-on
    if (selectedProduct === "memos" && addDisclosures) {
      total += 300; // Add disclosures add-on
    }
    
    // Add CPA review
    total += cpaReviewCount * 1000;
    
    return total;
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get all included features based on tier and product selection
  const getIncludedFeatures = () => {
    const features = [];
    
    // Product-specific features
    if (selectedProduct === "memos") {
      features.push("Unlimited AI-generated memos");
      if (addDisclosures) {
        features.push("Unlimited AI-generated disclosures");
      }
    } else if (selectedProduct === "disclosures") {
      features.push("Unlimited AI-generated disclosures");
    } else if (selectedProduct === "bundle") {
      features.push("Unlimited AI-generated memos");
      features.push("Unlimited AI-generated disclosures");
    }
    
    // Tier-specific features
    features.push("Version history");
    
    if (selectedTier === "mid" || selectedTier === "enterprise") {
      features.push("Internal approvals");
    }
    
    if (selectedTier === "enterprise") {
      features.push("Audit package");
    }
    
    return features;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 4: Order Summary</h2>
      
      <Card className="bg-muted/30 border-primary/30">
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">{getTierName()} {getProductName()}</h3>
              <ul className="space-y-2 mt-3 mb-6">
                {getIncludedFeatures().map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 divide-y divide-border">
            <div className="flex justify-between py-2">
              <span className="font-medium">{getTierName()} {getProductName()}</span>
              <span>{formatPrice(getTierBasePrice())}/month</span>
            </div>
            
            {selectedProduct === "memos" && addDisclosures && (
              <div className="flex justify-between py-2">
                <span className="font-medium">Disclosures Add-On</span>
                <span>+{formatPrice(300)}/month</span>
              </div>
            )}
            
            {cpaReviewCount > 0 && (
              <div className="flex justify-between py-2">
                <span className="font-medium">CPA Review × {cpaReviewCount}</span>
                <span>+{formatPrice(cpaReviewCount * 1000)}/month</span>
              </div>
            )}
            
            <div className="flex justify-between pt-4 font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}/month</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Billed annually. By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg"
            disabled={isLoading}
            onClick={onSubscribe}
          >
            {isLoading ? "Processing..." : "Subscribe Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
