
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSignupFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("emerging");
  const [showFirmContact, setShowFirmContact] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === "firms") {
      setShowFirmContact(true);
      setShowInfoForm(false);
    } else {
      setShowFirmContact(false);
      setShowInfoForm(false);
    }
    setStep(1);
  };

  const handleBackFromPayment = () => {
    setStep(1);
    setPaymentInfo(null);
  };

  const handleSubscribeClick = () => {
    setShowInfoForm(true);
  };

  // Function to handle checkout creation
  const createCheckout = async (userData: any, productInfo: any) => {
    setIsLoading(true);
    try {
      const priceIds = Array.isArray(productInfo.priceIds) ? 
        productInfo.priceIds : [productInfo.priceIds];
      
      console.log("Creating checkout with price IDs:", priceIds);
      console.log("User data:", userData);
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceIds,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
          userEmail: userData.email,
          userId: userData.userId,
          companyId: userData.companyId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          company: userData.company,
          phone: userData.phone
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to create checkout session");
      }
      
      if (data?.checkoutUrl) {
        console.log("Redirecting to checkout URL:", data.checkoutUrl);
        window.location.href = data.checkoutUrl;
        return true;
      } else {
        console.error("No checkout URL returned:", data);
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error creating checkout",
        description: error.message || "An error occurred while setting up payment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    step,
    setStep,
    userInfo,
    setUserInfo,
    paymentInfo,
    setPaymentInfo,
    showInfoForm,
    setShowInfoForm,
    selectedPlan,
    setSelectedPlan,
    showFirmContact,
    setShowFirmContact,
    navigate,
    toast,
    handlePlanChange,
    handleBackFromPayment,
    handleSubscribeClick,
    createCheckout
  };
};
