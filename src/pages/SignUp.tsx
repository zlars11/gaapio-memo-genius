
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { supabase } from "@/integrations/supabase/client";
import { SignUpInfoForm } from "./SignUpInfoForm";
import { SignUpPaymentForm } from "./SignUpPaymentForm";
import { SignUpSummary } from "./SignUpSummary";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// PLAN CONFIGURATION
const PLANS = [
  {
    id: "emerging",
    label: "Emerging", // Removed "Annual"
    price: 200,
    users: 3,
    description: "Up to 3 users",
    display: "$200/month <span class='text-sm font-normal'>(Paid Annually)</span>" // Added span for styling
  },
  {
    id: "mid",
    label: "Mid-Market", // Removed "Annual"
    price: 300,
    users: 6,
    description: "Up to 6 users",
    display: "$300/month <span class='text-sm font-normal'>(Paid Annually)</span>"
  },
  {
    id: "enterprise",
    label: "Enterprise", // Removed "Annual"
    price: 500,
    users: "Unlimited",
    description: "Unlimited users",
    display: "$500/month <span class='text-sm font-normal'>(Paid Annually)</span>"
  },
  {
    id: "firms",
    label: "Firms",
    price: null,
    users: null,
    description: "Contact Sales",
    display: "Contact Sales"
  },
];

const PLAN_FEATURES = [
  "Unlimited AI-generated memos",
  "Free premium templates",
  "Team collaboration tools",
];

// Helper functions to get Zapier webhook URLs from localStorage
function getUserSignupZapierWebhookUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userSignupWebhookUrl") || "";
  }
  return "";
}

// New helper function to get firm signup webhook URL
function getFirmSignupZapierWebhookUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("firmSignupWebhookUrl") || "";
  }
  return "";
}

// Helper to match DB column names, updated to include plan, term, and amount
function mapUserToDb(info: any) {
  return {
    firstname: info.firstName,
    lastname: info.lastName,
    email: info.email,
    phone: info.phone,
    company: info.company,
    plan: info.plan || "emerging",
    term: info.term || "annual",
    amount: info.amount,
    signupdate: new Date().toISOString(),
    status: info.status || "active",
  };
}

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("emerging");
  const [selectedTerm, setSelectedTerm] = useState("annual");
  const [showFirmContact, setShowFirmContact] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // First form: user's details - force plan & term
  const infoForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      plan: selectedPlan,
      term: "annual", // <--- ensure annual as default
      amount: getPlanLabel(selectedPlan),
    },
  });

  // Payment form for step 2
  const paymentForm = useForm({
    defaultValues: {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      billingZip: "",
    },
  });

  function getPlanObject(planId: string) {
    return PLANS.find(p => p.id === planId) || PLANS[0];
  }
  function getPlanLabel(planId: string) {
    const plan = getPlanObject(planId);
    return plan ? plan.display : "Contact Sales";
  }

  // Helper: insert into Supabase user_signups table
  async function createUserSignup(info: any) {
    const dbInfo = mapUserToDb({ ...info, term: info.term || "annual" }); // safest default
    const { data, error } = await supabase.from("user_signups").insert([dbInfo]);
    if (error) throw new Error(error.message);
    return data;
  }

  // Helper: Create firm signup in Supabase - FIXED FUNCTION
  async function createFirmSignup(info: any) {
    const firmData = {
      type: "firm",
      company: info.company,
      firstname: info.firstName || info.firstname,
      lastname: info.lastName || info.lastname,
      email: info.email,
      phone: info.phone,
      amount: "Contact Sales", // Required field
      status: "active", // Required field
      signupdate: new Date().toISOString(),
      plan: "firms"
      // Removed 'notes' field as it doesn't exist in the database schema
    };
    
    const { data, error } = await supabase.from("user_signups").insert(firmData);
    if (error) throw new Error(error.message);
    return data;
  }

  // Helper: Trigger zapier with all form data
  async function triggerZapier(allData: any, isFirm: boolean = false) {
    // Fetch dynamically from localStorage (set by admin panel)
    const ZAPIER_WEBHOOK_URL = isFirm ? 
      getFirmSignupZapierWebhookUrl() : 
      getUserSignupZapierWebhookUrl();

    if (!ZAPIER_WEBHOOK_URL) {
      toast({
        title: "Zapier not configured",
        description: `No Zapier webhook URL set for ${isFirm ? 'Firm' : 'User'} Signups. Please set it in the Admin panel.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log(`Triggering ${isFirm ? 'firm' : 'user'} Zapier webhook:`, ZAPIER_WEBHOOK_URL);
      
      // Format data to match Zapier email template field names
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
      // Ignore non-blocking errors (no-cors)
    }
  }

  // PLAN SELECTOR HANDLER
  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    infoForm.setValue("plan", planId);
    infoForm.setValue("term", "annual"); // Hard set every plan change

    if (planId === "firms") {
      setShowFirmContact(true);
      setShowInfoForm(false);
    } else {
      setShowFirmContact(false);
      setShowInfoForm(false);
    }
    setStep(1);
  };

  // TERM SELECTOR HANDLER (not used in UI, but keep for future-proofing)
  const handleTermChange = (term: string) => {
    setSelectedTerm(term);
    infoForm.setValue("term", term || "annual");
  };

  // STEP 1: Show pricing/plan selector
  const handleSubscribeClick = () => {
    setShowInfoForm(true);
  };

  // Back button handler for step 2
  const handleBackFromPayment = () => {
    setStep(1);
    setPaymentInfo(null);
  };

  // STEP 1.5: User info form submit
  const onInfoSubmit = (data: any) => {
    // ALWAYS force annual
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserInfo({ ...data, term: "annual" });
      setStep(2);
    }, 300);
  };

  // STEP 2: Payment info form submit
  const onPaymentSubmit = async (paymentData: any) => {
    setIsLoading(true);

    setTimeout(async () => {
      setPaymentInfo(paymentData);
      // Save user info with term=annual
      try {
        await createUserSignup({ ...userInfo, term: "annual" });
      } catch (err: any) {
        setIsLoading(false);
        toast({ title: "Submission failed", description: err.message, variant: "destructive" });
        return;
      }

      // Send allData (user details + payment) to Zapier for notification
      const allData = { ...userInfo, ...paymentData, plan: selectedPlan, term: "annual", amount: getPlanLabel(selectedPlan), signupDate: new Date().toISOString() };
      await triggerZapier(allData);

      setIsLoading(false);
      setStep(3);

      toast({
        title: "Thank you for subscribing to Gaapio!",
        description: "We've received your info. You'll receive a confirmation soon.",
      });
    }, 1200);
  };

  // FIRM CONTACT FORM handler
  async function handleFirmContactSuccess(formData: any) {
    try {
      // Save firm signup to database
      await createFirmSignup(formData);
      
      // Send firm data to Zapier
      await triggerZapier({
        ...formData,
        signupDate: new Date().toISOString(),
        type: "firm"
      }, true);
      
      toast({
        title: "Thank you for your interest!",
        description: "We've received your information and will be in touch soon.",
      });
      
      setShowFirmContact(false);
      setStep(3);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  // --- MAIN RENDER ---
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <ResponsiveContainer>
          {step === 3 ? (
            // Success/thank you step
            <div className="text-center py-12">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Thank You for Your Submission!</h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                {showFirmContact
                  ? "Our team will contact you soon to discuss your firm's needs."
                  : "We've sent a confirmation email with your account details. You'll be able to access your account shortly."
                }
              </p>
              {!showFirmContact && (
                <div className="mb-8">
                  <Card className="inline-block bg-muted/40 text-left">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Submitted Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userInfo && (
                        <SignUpSummary userInfo={userInfo} paymentInfo={paymentInfo} ANNUAL_LABEL={getPlanLabel(selectedPlan)} />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
              <Button onClick={() => navigate("/")} size="lg">
                Return to Homepage
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Gaapio</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get started with AI-powered accounting memos on our Annual Plan.
                </p>
              </div>
              {/* *** PLAN SELECTOR AS TABS *** */}
              <div className="max-w-2xl mx-auto my-8">
                <Tabs defaultValue={selectedPlan} value={selectedPlan} onValueChange={handlePlanChange}>
                  <TabsList className="w-full mb-4 gap-0 overflow-hidden flex justify-between glass-morphism">
                    {PLANS.map(plan => (
                      <TabsTrigger
                        key={plan.id}
                        value={plan.id}
                        className={`
                          w-1/4 px-0 py-3 text-base rounded-none border-0
                          font-medium tracking-tight transition-colors
                          border-r border-muted last:border-r-0
                          data-[state=active]:font-semibold
                        `}
                        style={{
                          minWidth: 0,
                          minHeight: 0,
                        }}
                        data-testid={`plan-tab-${plan.id}`}
                      >
                        {plan.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {/* -- CARD FOR SELECTED PLAN OR FIRMS -- */}
                  <div>
                    {selectedPlan !== "firms" ? (
                      <>
                        {step === 1 && !showInfoForm && (
                          <Card className="w-full max-w-2xl mx-auto my-6 border-primary shadow-lg bg-muted/40 glass-morphism">
                            <CardHeader>
                              <CardTitle className="text-2xl">{getPlanObject(selectedPlan).label} Subscription</CardTitle>
                              {/* Only show CardDescription except on Emerging */}
                              {selectedPlan !== "emerging" && (
                                <div className="mt-1 text-muted-foreground text-base">{/* no extra label */}</div>
                              )}
                              <div className="mt-4">
                                <span className="text-4xl font-bold" dangerouslySetInnerHTML={{ __html: getPlanLabel(selectedPlan) }} />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 text-base mb-4">
                                {/* Move users at TOP */}
                                {getPlanObject(selectedPlan).users && (
                                  <li className="flex items-center">
                                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                                    {getPlanObject(selectedPlan).description}
                                  </li>
                                )}
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
                                type="button"
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
                            term={"annual"}
                          />
                        )}
                        {step === 2 && (
                          <div className="max-w-2xl mx-auto">
                            <div className="mb-2">
                              <Button
                                variant="outline"
                                className="mb-4"
                                type="button"
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
                        )}
                        {step === 2 && userInfo && (
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
                    ) : (
                      // FIRMS CARD, improved card effect and overlay for both modes
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
                </Tabs>
              </div>
            </>
          )}
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}

// --- FIRM CONTACT FORM COMPONENT ---
import { ContactForm } from "@/components/contact/ContactForm";
function FirmContactForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  return <ContactForm onSubmitSuccess={onSuccess} />;
}
