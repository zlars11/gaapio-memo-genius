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

// PLAN CONFIGURATION
const PLANS = [
  {
    id: "emerging",
    label: "Emerging",
    price: 2400,
    users: 3,
    description: "Up to 3 users"
  },
  {
    id: "mid",
    label: "Mid",
    price: 3500,
    users: 6,
    description: "Up to 6 users"
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: 5000,
    users: "Unlimited",
    description: "Unlimited users"
  },
  {
    id: "firms",
    label: "Firms",
    price: null,
    users: null,
    description: "Contact Sales"
  },
];

const PLAN_FEATURES = [
  "Unlimited AI-generated memos",
  "Free premium templates",
  "Team collaboration tools",
  "API access",
];

// Obtain Zapier webhook URL from localStorage so it can be set from admin settings
function getUserSignupZapierWebhookUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userSignupWebhookUrl") || "";
  }
  return "";
}

// REMOVE hardcoded Zapier webhook
// const ZAPIER_WEBHOOK_URL = "";

// Remove hardcoded ANNUAL_PRICE/ANNUAL_LABEL
// const ANNUAL_PRICE = 249900; // in cents ($2,499.00)
// const ANNUAL_LABEL = "$2,499";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showFirmContact, setShowFirmContact] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // First form: user's details
  const infoForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      plan: selectedPlan,
      term: selectedTerm,
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
    return plan && plan.price !== null ? `$${plan.price.toLocaleString()}` : "Contact Sales";
  }

  // Helper: insert into Supabase user_signups table
  async function createUserSignup(info: any) {
    const dbInfo = mapUserToDb(info);
    const { data, error } = await supabase.from("user_signups").insert([dbInfo]);
    if (error) throw new Error(error.message);
    return data;
  }

  // Helper: Trigger zapier with all form data
  async function triggerZapier(allData: any) {
    // Fetch dynamically from localStorage (set by admin panel)
    const ZAPIER_WEBHOOK_URL = getUserSignupZapierWebhookUrl();

    if (!ZAPIER_WEBHOOK_URL) {
      toast({
        title: "Zapier not configured",
        description: "No Zapier webhook URL set for User Signups. Please set it in the Admin panel.",
        variant: "destructive",
      });
      return;
    }
    try {
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify(allData),
      });
    } catch (err) {
      // Ignore non-blocking errors (no-cors)
    }
  }

  // PLAN SELECTOR HANDLER
  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    infoForm.setValue("plan", planId);
    // Firms has no price or payment, skip payment step and show firm contact
    if (planId === "firms") {
      setShowFirmContact(true);
      setShowInfoForm(false);
    } else {
      setShowFirmContact(false);
      setShowInfoForm(false);
    }
  };

  // TERM SELECTOR HANDLER
  const handleTermChange = (term: string) => {
    setSelectedTerm(term);
    infoForm.setValue("term", term);
  };

  // MODIFIED: Plan and term forced to annual for sign up, but visible in admin
  // (user can change plan/term at sign up if we ever open this, UI supports it)
  // (For self-signup: only annual is selectable, but support dropdown for admin.)

  // STEP 1: Show pricing/plan selector
  const handleSubscribeClick = () => {
    setShowInfoForm(true);
  };

  // Updated: Add back button handler for step 2
  const handleBackFromPayment = () => {
    setStep(1);
    setPaymentInfo(null);
  };

  // STEP 1.5: User info form submit
  const onInfoSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserInfo(data);
      setStep(2);
    }, 300);
  };

  // STEP 2: Payment info form submit
  const onPaymentSubmit = async (paymentData: any) => {
    setIsLoading(true);

    setTimeout(async () => {
      setPaymentInfo(paymentData);
      // Save only the user info (personal, not card!) to Supabase for compliance
      try {
        await createUserSignup(userInfo);
      } catch (err: any) {
        setIsLoading(false);
        toast({ title: "Submission failed", description: err.message, variant: "destructive" });
        return;
      }

      // Send allData (user details + payment) to Zapier for notification
      const allData = { ...userInfo, ...paymentData, plan: "annual", amount: getPlanLabel(selectedPlan), signupDate: new Date().toISOString() };
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
  function handleFirmContactSuccess() {
    setShowFirmContact(false);
    setStep(3);
  }

  // Helper: show summary. Update features to show correct user count.
  function InfoSummary() {
    return (
      <ul className="text-left mx-auto mb-6 max-w-md space-y-2">
        <li><span className="font-medium">First Name:</span> {userInfo.firstName}</li>
        <li><span className="font-medium">Last Name:</span> {userInfo.lastName}</li>
        <li><span className="font-medium">Email:</span> {userInfo.email}</li>
        <li><span className="font-medium">Phone:</span> {userInfo.phone}</li>
        <li><span className="font-medium">Company:</span> {userInfo.company}</li>
        <li><span className="font-medium">Plan:</span> Annual Subscription ({getPlanLabel(selectedPlan)})</li>
        {paymentInfo && (
          <>
            <li><span className="font-medium">Card Number:</span> ••••{(paymentInfo.cardNumber || "").slice(-4)}</li>
            <li><span className="font-medium">Expiry:</span> {paymentInfo.cardExpiry}</li>
            <li><span className="font-medium">Billing Zip:</span> {paymentInfo.billingZip}</li>
          </>
        )}
      </ul>
    );
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
              {/* SUMMARIZE INFO */}
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
          ) : showFirmContact ? (
            // Show firm contact form
            <div className="max-w-lg mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Sales</CardTitle>
                  <CardDescription>
                    Please fill out the form below and our team will reach out to discuss your firm's needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FirmContactForm onSuccess={handleFirmContactSuccess} />
                </CardContent>
              </Card>
            </div>
          ) : (
            // -- Regular plan signup flow
            <>
              <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign Up for Gaapio</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get started with AI-powered accounting memos on our Annual Plan.
                </p>
              </div>
              {/* PLAN TABS/SELECTOR */}
              <div className="max-w-2xl mx-auto my-8">
                <div className="flex justify-center mb-6 gap-2 flex-wrap">
                  {PLANS.map(plan => (
                    <Button
                      key={plan.id}
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                      onClick={() => handlePlanChange(plan.id)}
                      className="px-6 py-2 text-base"
                    >
                      {plan.label}
                    </Button>
                  ))}
                </div>
              </div>
              {/* PLAN CARD */}
              {step === 1 && !showInfoForm && (
                <Card className="max-w-2xl mx-auto my-6 border-primary shadow-lg bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-2xl">{getPlanObject(selectedPlan).label} Subscription</CardTitle>
                    <CardDescription>per year (save 30%)</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{getPlanLabel(selectedPlan)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-base mb-4">
                      {PLAN_FEATURES.map(f => (
                        <li className="flex items-center" key={f}>
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                      {getPlanObject(selectedPlan).users && (
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          {getPlanObject(selectedPlan).description}
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {selectedPlan !== "firms" ? (
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
                    ) : (
                      <Button
                        size="lg"
                        className="w-full"
                        type="button"
                        variant="secondary"
                        onClick={() => setShowFirmContact(true)}
                      >
                        Contact Sales
                      </Button>
                    )}
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
                  term={selectedTerm}
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
          )}
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}

// --- FIRM CONTACT FORM COMPONENT ---
import { ContactForm } from "@/components/contact/ContactForm";
function FirmContactForm({ onSuccess }: { onSuccess: () => void }) {
  // Use the existing ContactForm, but intercept after submit
  // We'll just show the ContactForm and on success show thank you above
  // The ContactForm already shows its own success toast
  return <ContactForm />;
}
