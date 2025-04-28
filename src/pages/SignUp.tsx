
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useSignupFlow } from "@/hooks/useSignupFlow";
import { SignUpInfoForm } from "./SignUpInfoForm";
import { SignUpPaymentForm } from "./SignUpPaymentForm";
import { SignUpSummary } from "./SignUpSummary";
import { SignupSuccess } from "@/components/signup/SignupSuccess";
import { PlanTabs } from "@/components/signup/PlanTabs";
import { PLAN_FEATURES, getPlanObject, getPlanLabel } from "@/constants/planConfig";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

// Firm Contact Form Component
function FirmContactForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  return <ContactForm onSubmitSuccess={onSuccess} />;
}

export default function SignUp() {
  const {
    isLoading,
    setIsLoading,
    step,
    setStep,
    userInfo,
    setUserInfo,
    paymentInfo,
    setPaymentInfo,
    showInfoForm,
    selectedPlan,
    showFirmContact,
    navigate,
    toast,
    handlePlanChange,
    handleBackFromPayment,
    handleSubscribeClick,
  } = useSignupFlow();

  // Form initialization
  const infoForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      plan: selectedPlan,
      term: "annual",
      amount: getPlanLabel(selectedPlan),
    },
  });

  const paymentForm = useForm({
    defaultValues: {
      billingContact: "",
      billingEmail: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      billingZip: "",
    },
  });

  // Form submission handlers
  const onInfoSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserInfo({ ...data, term: "annual" });
      setStep(2);
    }, 300);
  };

  const onPaymentSubmit = async (paymentData: any) => {
    setIsLoading(true);
    
    setTimeout(async () => {
      setPaymentInfo(paymentData);
      try {
        const selectedPlanObj = getPlanObject(selectedPlan);
        
        // Get the annualAmount as a number 
        const annualAmount = Number(selectedPlanObj?.annualAmount || 0);
        
        // Make sure plan value matches valid database options (assuming the constraint matches these exact values)
        let dbPlan = selectedPlan;
        if (selectedPlan === "mid") {
          dbPlan = "mid-market";
        } else if (selectedPlan === "firms") {
          dbPlan = "firm";
        }
        
        console.log("Creating company with plan:", dbPlan);
        
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: userInfo.company,
            plan: dbPlan, // Use the corrected plan value
            status: "active",
            amount: annualAmount, // Pass as number, not string
            billing_frequency: "annual",
            billing_contact: paymentData.billingContact, // Use billing data from payment form
            billing_email: paymentData.billingEmail, // Use billing data from payment form
            paid_users: String(selectedPlanObj?.users || '3')
          })
          .select()
          .single();
          
        if (companyError) throw companyError;
        
        const userData = {
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          email: userInfo.email,
          phone: userInfo.phone,
          company_id: companyData.id,
          user_type: "user",
          status: "active"
        };
        
        const { error: userError } = await supabase
          .from("users")
          .insert([userData]);

        if (userError) throw userError;

        const allData = { 
          ...userInfo, 
          ...paymentData,
          plan: dbPlan, // Use corrected plan value
          term: "annual", 
          amount: getPlanLabel(selectedPlan), 
          signupDate: new Date().toISOString() 
        };
        
        await triggerZapier(allData);

        setIsLoading(false);
        setStep(3);

        toast({
          title: "Thank you for subscribing to Gaapio!",
          description: "We've received your info. You'll receive a confirmation soon.",
        });
      } catch (err: any) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive"
        });
      }
    }, 1200);
  };

  // Firm contact form handler
  const handleFirmContactSuccess = async (formData: any) => {
    try {
      console.log("Form data received for firm contact:", formData);
      
      await createFirmSignup(formData);
      
      await triggerZapier({
        ...formData,
        signupDate: new Date().toISOString(),
        type: "firm"
      }, true);
      
      toast({
        title: "Thank you for your interest!",
        description: "We've received your information and will be in touch soon.",
      });
      
      setStep(3);
    } catch (error: any) {
      console.error("Firm signup error:", error);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (step === 3) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-16">
          <ResponsiveContainer>
            <SignupSuccess
              showFirmContact={showFirmContact}
              userInfo={userInfo}
              paymentInfo={paymentInfo}
              selectedPlan={selectedPlan}
              onHomeClick={() => navigate("/")}
            />
          </ResponsiveContainer>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <ResponsiveContainer>
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Gaapio</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with AI-powered accounting memos on our Annual Plan.
            </p>
          </div>

          <div className="max-w-2xl mx-auto my-8">
            <PlanTabs selectedPlan={selectedPlan} onPlanChange={handlePlanChange} />
            
            <div>
              {selectedPlan !== "firms" ? (
                <>
                  {step === 1 && !showInfoForm && (
                    <Card className="w-full max-w-2xl mx-auto my-6 border-primary shadow-lg bg-muted/40 glass-morphism">
                      <CardHeader>
                        <CardTitle className="text-2xl">{getPlanObject(selectedPlan).label} Subscription</CardTitle>
                        <div className="mt-4">
                          <span className="text-4xl font-bold" dangerouslySetInnerHTML={{ __html: getPlanLabel(selectedPlan) }} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-base mb-4">
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            {getPlanObject(selectedPlan).description}
                          </li>
                          {PLAN_FEATURES.map(f => (
                            <li className="flex items-center" key={f}>
                              <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handleSubscribeClick}
                          disabled={isLoading}
                          data-testid="subscribe-now-btn"
                        >
                          {isLoading ? "Processing..." : "Subscribe Now"}
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                  {step === 1 && showInfoForm && (
                    <SignUpInfoForm
                      isLoading={isLoading}
                      infoForm={infoForm}
                      onSubmit={onInfoSubmit}
                      ANNUAL_LABEL={getPlanLabel(selectedPlan)}
                      plan={selectedPlan}
                      term="annual"
                    />
                  )}
                  {step === 2 && (
                    <>
                      <div className="max-w-2xl mx-auto">
                        <div className="mb-2">
                          <Button
                            variant="outline"
                            className="mb-4"
                            onClick={handleBackFromPayment}
                            disabled={isLoading}
                          >
                            Back
                          </Button>
                        </div>
                        <SignUpPaymentForm
                          isLoading={isLoading}
                          paymentForm={paymentForm}
                          onSubmit={onPaymentSubmit}
                        />
                      </div>
                      {userInfo && (
                        <div className="max-w-2xl mx-auto mt-4 mb-4">
                          <Card className="bg-background">
                            <CardHeader>
                              <CardTitle className="text-base font-bold">Review Your Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <SignUpSummary userInfo={userInfo} ANNUAL_LABEL={getPlanLabel(selectedPlan)} />
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Card className="w-full max-w-2xl mx-auto my-6 border-primary shadow-lg glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-2xl !text-foreground">Firm</CardTitle>
                    <div className="mt-2 text-3xl font-bold !text-foreground">Contact Sales</div>
                  </CardHeader>
                  <CardContent>
                    <FirmContactForm onSuccess={handleFirmContactSuccess} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}

// Helper functions
async function createFirmSignup(formData: any) {
  // Create the company
  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: formData.company,
      plan: "firm",  // Updated from "firms" to match the constraint
      status: "active",
      amount: 0
    })
    .select()
    .single();
    
  if (companyError) throw companyError;
  
  // Then create the user
  const userData = {
    first_name: formData.firstName || formData.firstname || "", 
    last_name: formData.lastName || formData.lastname || "",    
    email: formData.email,
    phone: formData.phone,
    company_id: companyData.id,
    user_type: "user",
    status: "active"
  };
  
  const { error: userError } = await supabase
    .from("users")
    .insert([userData]);
    
  if (userError) throw userError;
}

async function triggerZapier(allData: any, isFirm: boolean = false) {
  const ZAPIER_WEBHOOK_URL = isFirm ? 
    getFirmSignupZapierWebhookUrl() : 
    getUserSignupZapierWebhookUrl();

  if (!ZAPIER_WEBHOOK_URL) {
    throw new Error(`No Zapier webhook URL set for ${isFirm ? 'Firm' : 'User'} Signups`);
  }
  
  try {
    console.log(`Triggering ${isFirm ? 'firm' : 'user'} Zapier webhook:`, ZAPIER_WEBHOOK_URL);
    
    const formattedData = isFirm ? {
      "Firm Name": allData.company,
      "Contact Name": `${allData.firstName || allData.firstname} ${allData.lastName || allData.lastname}`,
      "Email": allData.email,
      "Phone": allData.phone,
      "Notes": allData.message || "",
      "Submission Date": new Date().toISOString(),
    } : allData;
    
    await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(formattedData),
    });
    console.log("Zapier webhook triggered successfully");
  } catch (err) {
    console.error("Error triggering Zapier webhook:", err);
  }
}

function getUserSignupZapierWebhookUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userSignupWebhookUrl") || "";
  }
  return "";
}

function getFirmSignupZapierWebhookUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("firmSignupWebhookUrl") || "";
  }
  return "";
}
