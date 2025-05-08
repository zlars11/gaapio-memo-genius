
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useToast } from "@/components/ui/use-toast";
import { GuidedFlowSteps } from "@/components/signup/GuidedFlowSteps";
import { ClientTypeSelector } from "@/components/signup/ClientTypeSelector";
import { TierSelector } from "@/components/signup/TierSelector";
import { ProductSelector } from "@/components/signup/ProductSelector";
import { AddOnsSelector } from "@/components/signup/AddOnsSelector";
import { OrderSummary } from "@/components/signup/OrderSummary";
import { UserInfoForm, UserFormData } from "@/components/signup/UserInfoForm";
import { FirmContactForm } from "@/components/signup/FirmContactForm"; 
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getSelectedPriceIds } from "@/utils/priceUtils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);  // Starting from 0 for client type selection
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserFormData | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Client type step
  const [selectedClientType, setSelectedClientType] = useState("company");

  // Subscription options state
  const [selectedTier, setSelectedTier] = useState("emerging");
  const [selectedProduct, setSelectedProduct] = useState("memos");
  const [addDisclosures, setAddDisclosures] = useState(false);
  const [cpaReviewCount, setCpaReviewCount] = useState(0);

  // Navigation functions
  const goToNextStep = () => {
    if (selectedClientType === "firm") {
      navigate("/firm-signup");
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle client type selection
  const handleClientTypeSelect = (type: string) => {
    setSelectedClientType(type);
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

  // Handle showing user info form
  const handleProceedToUserInfo = () => {
    setShowUserForm(true);
  };

  // Handle back from user form
  const handleBackFromUserForm = () => {
    setShowUserForm(false);
  };

  // Handle user info submission
  const handleUserInfoSubmit = async (formData: UserFormData) => {
    setUserInfo(formData);
    setIsLoading(true);
    setError(null);

    try {
      // First create or get the user and company
      console.log("Creating user and company with data:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        tier: selectedTier === "mid" ? "midMarket" : selectedTier,
        product: selectedProduct
      });

      const { data: signupData, error: signupError } = await supabase.functions.invoke("create-user-company", {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || "",
          company: formData.company,
          tier: selectedTier === "mid" ? "midMarket" : selectedTier,
          product: selectedProduct
        }
      });

      if (signupError || !signupData) {
        console.error("Error creating user/company:", signupError);
        throw new Error(signupError?.message || 'Failed to create user account');
      }

      console.log("User and company created successfully:", signupData);

      // Map the selected product to price IDs
      const priceIds = getSelectedPriceIds(
        selectedProduct === "bundle" ? "bundle" : selectedProduct as "memos" | "disclosures",
        selectedTier === "mid" ? "midMarket" : selectedTier as "emerging" | "enterprise",
        selectedProduct === "memos" && addDisclosures,
        cpaReviewCount
      );

      console.log("Using price IDs for checkout:", priceIds);

      // Call the Supabase Edge Function to create checkout
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceIds,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
          userEmail: formData.email,
          userId: signupData?.userId,
          companyId: signupData?.companyId
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      if (data?.checkoutUrl) {
        console.log("Redirecting to checkout URL:", data.checkoutUrl);
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        console.error("No checkout URL returned:", data);
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      
      setError(error.message || "Something went wrong. Please try again.");
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle firm contact form submission
  const handleFirmFormSuccess = (data: any) => {
    toast({
      title: "Form Submitted",
      description: "Thanks for your interest! Our team will be in touch with you shortly.",
    });
    navigate("/");
  };

  // Adjust the steps array based on the client type
  const getStepTitle = (stepIndex: number) => {
    if (selectedClientType === "firm") {
      return "CPA Firm Information";
    }
    
    const companySteps = [
      "Select Your Account Type",
      "Select Your Tier", 
      "Select Your Product", 
      "Add-Ons (Optional)", 
      "Order Summary"
    ];
    
    return companySteps[stepIndex];
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer>
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Gaapio</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with AI-powered accounting on our Annual Plan.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {currentStep > 0 && selectedClientType === "company" && (
              <GuidedFlowSteps currentStep={currentStep} />
            )}

            <ErrorBoundary fallback={
              <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md my-4">
                <p className="text-red-500 dark:text-red-400">An error occurred loading this section. Please try refreshing the page or contact support.</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">Refresh Page</Button>
              </div>
            }>
              {!showUserForm ? (
                <>
                  {currentStep === 0 && (
                    <ClientTypeSelector
                      selectedType={selectedClientType}
                      onSelectType={handleClientTypeSelect}
                    />
                  )}
                  
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
                      onSubscribe={handleProceedToUserInfo}
                    />
                  )}

                  <div className="flex justify-between mt-8">
                    {currentStep > 0 ? (
                      <Button variant="outline" onClick={goToPreviousStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    ) : (
                      <div></div>
                    )}

                    <Button onClick={goToNextStep}>
                      {currentStep === 0 && selectedClientType === "firm" ? "Continue as CPA Firm" : "Continue"} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <UserInfoForm 
                  onSubmit={handleUserInfoSubmit}
                  onBack={handleBackFromUserForm}
                  isLoading={isLoading}
                />
              )}
            </ErrorBoundary>

            {error && (
              <div className="mt-4 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
                <p className="text-red-700 dark:text-red-400">{error}</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-2">
                  If this issue persists, please contact support at support@gaapio.com
                </p>
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
