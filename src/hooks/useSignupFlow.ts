
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
  };
};
