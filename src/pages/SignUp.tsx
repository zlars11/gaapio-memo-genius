
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useToast } from "@/components/ui/use-toast";
import { GuidedFlowSteps } from "@/components/signup/GuidedFlowSteps";
import { TierSelector } from "@/components/signup/TierSelector";
import { ProductSelector } from "@/components/signup/ProductSelector";
import { AddOnsSelector } from "@/components/signup/AddOnsSelector";
import { OrderSummary } from "@/components/signup/OrderSummary";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getSelectedPriceIds } from "@/utils/priceUtils";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Subscription options state
  const [selectedTier, setSelectedTier] = useState("emerging");
  const [selectedProduct, setSelectedProduct] = useState("memos");
  const [addDisclosures, setAddDisclosures] = useState(false);
  const [cpaReviewCount, setCpaReviewCount] = useState(0);

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle tier selection
  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
  };

  // Handle product selection
  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
    // If bundle is selected, disable disclosures add-on
    if (product === "bundle") {
      setAddDisclosures(false);
    }
  };

  // Handle subscription
  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      // Map the selected product to price IDs
      const priceIds = getSelectedPriceIds(
        selectedProduct === "bundle" ? "bundle" : selectedProduct as "memos" | "disclosures",
        selectedTier === "mid" ? "midMarket" : selectedTier as "emerging" | "enterprise",
        selectedProduct === "memos" && addDisclosures,
        cpaReviewCount
      );

      // Call the Supabase Edge Function to create checkout
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceIds,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`
        }
      });

      if (error) throw new Error(error.message || 'Failed to create checkout session');
      
      if (data?.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <ResponsiveContainer>
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Gaapio</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with AI-powered accounting on our Annual Plan.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <GuidedFlowSteps currentStep={currentStep} />

            {currentStep === 1 && (
              <TierSelector
                selectedTier={selectedTier}
                onSelectTier={handleTierSelect}
              />
            )}

            {currentStep === 2 && (
              <ProductSelector
                selectedProduct={selectedProduct}
                onSelectProduct={handleProductSelect}
                selectedTier={selectedTier}
              />
            )}

            {currentStep === 3 && (
              <AddOnsSelector
                selectedProduct={selectedProduct}
                addDisclosures={addDisclosures}
                onAddDisclosuresChange={setAddDisclosures}
                cpaReviewCount={cpaReviewCount}
                onCpaReviewCountChange={setCpaReviewCount}
              />
            )}

            {currentStep === 4 && (
              <OrderSummary
                selectedTier={selectedTier}
                selectedProduct={selectedProduct}
                addDisclosures={addDisclosures}
                cpaReviewCount={cpaReviewCount}
                isLoading={isLoading}
                onSubscribe={handleSubscribe}
              />
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 && (
                <Button onClick={goToNextStep}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
