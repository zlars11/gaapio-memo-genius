import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useToast } from "@/components/ui/use-toast";
import { ClientTypeSelector } from "@/components/signup/ClientTypeSelector";
import { TierSelector } from "@/components/signup/TierSelector";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StripePricingTable } from "@/components/signup/StripePricingTable";

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedClientType, setSelectedClientType] = useState("company");
  const [selectedTier, setSelectedTier] = useState("");
  const { toast } = useToast();

  // Handle client type selection
  const handleClientTypeSelect = (type: string) => {
    setSelectedClientType(type);
    
    // If firm is selected, navigate to firm signup page
    if (type === "firm") {
      navigate("/firm-signup");
    } else {
      // Otherwise, go to the next step (tier selection)
      setCurrentStep(1);
    }
  };

  // Handle tier selection
  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    // Move to pricing table step
    setCurrentStep(2);
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Clear tier selection when going back to client type
      if (currentStep === 1) {
        setSelectedTier("");
      }
    }
  };

  // Get pricing table ID based on selected tier
  const getPricingTableId = () => {
    switch (selectedTier) {
      case "emerging":
        return "prctbl_1RO18aQx8kjcVg7rA1h0xchx";
      case "mid":
        return "prctbl_1RO17DQx8kjcVg7rFCsfnRYl";
      case "enterprise":
        return "prctbl_1RO14oQx8kjcVg7rXTf0NaGq";
      default:
        return "";
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ClientTypeSelector
            selectedType={selectedClientType}
            onSelectType={handleClientTypeSelect}
          />
        );
      case 1:
        return (
          <TierSelector
            selectedTier={selectedTier}
            onSelectTier={handleTierSelect}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select a Plan</h2>
            <StripePricingTable pricingTableId={getPricingTableId()} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer>
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Gaapio</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with AI-powered accounting.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ErrorBoundary fallback={
              <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md my-4">
                <p className="text-red-500 dark:text-red-400">An error occurred loading this section. Please try refreshing the page or contact support.</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">Refresh Page</Button>
              </div>
            }>
              {renderStepContent()}

              {currentStep > 0 && (
                <div className="mt-8">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
