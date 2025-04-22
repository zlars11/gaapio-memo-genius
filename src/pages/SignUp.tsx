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

// TODO: PLACE your Zapier webhook URL here
const ZAPIER_WEBHOOK_URL = "";

const ANNUAL_PRICE = 249900; // in cents ($2,499.00)
const ANNUAL_LABEL = "$2,499";

// Helper to match DB column names
function mapUserToDb(info: any) {
  return {
    firstname: info.firstName,
    lastname: info.lastName,
    email: info.email,
    phone: info.phone,
    company: info.company,
    plan: "annual",
    amount: ANNUAL_LABEL,
    signupdate: new Date().toISOString(),
    status: "active",
  };
}

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
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

  // Helper: insert into Supabase user_signups table
  async function createUserSignup(info: any) {
    const dbInfo = mapUserToDb(info);
    const { data, error } = await supabase.from("user_signups").insert([dbInfo]);
    if (error) throw new Error(error.message);
    return data;
  }

  // Helper: Trigger zapier with all form data
  async function triggerZapier(allData: any) {
    if (!ZAPIER_WEBHOOK_URL) {
      // Zapier not configured. Optionally show a toast.
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

  // STEP 1: User info form submit
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
      const allData = { ...userInfo, ...paymentData, plan: "annual", amount: ANNUAL_LABEL, signupDate: new Date().toISOString() };
      await triggerZapier(allData);

      setIsLoading(false);
      setStep(3);

      toast({
        title: "Thank you for subscribing to Gaapio!",
        description: "We've received your info. You'll receive a confirmation soon.",
      });
    }, 1200);
  };

  // Helper: show summary
  function InfoSummary() {
    return (
      <ul className="text-left mx-auto mb-6 max-w-md space-y-2">
        <li><span className="font-medium">First Name:</span> {userInfo.firstName}</li>
        <li><span className="font-medium">Last Name:</span> {userInfo.lastName}</li>
        <li><span className="font-medium">Email:</span> {userInfo.email}</li>
        <li><span className="font-medium">Phone:</span> {userInfo.phone}</li>
        <li><span className="font-medium">Company:</span> {userInfo.company}</li>
        <li><span className="font-medium">Plan:</span> Annual Subscription ({ANNUAL_LABEL})</li>
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
              <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We've sent a confirmation email with your account details. You'll be able to access your account shortly.
              </p>
              <div className="mb-8">
                <Card className="inline-block bg-muted/40 text-left">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Submitted Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userInfo && (
                      <SignUpSummary userInfo={userInfo} paymentInfo={paymentInfo} ANNUAL_LABEL={ANNUAL_LABEL} />
                    )}
                  </CardContent>
                </Card>
              </div>
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
              {step === 1 && (
                <SignUpInfoForm
                  isLoading={isLoading}
                  infoForm={infoForm}
                  onSubmit={onInfoSubmit}
                  ANNUAL_LABEL={ANNUAL_LABEL}
                />
              )}
              {step === 2 && (
                <SignUpPaymentForm
                  isLoading={isLoading}
                  paymentForm={paymentForm}
                  onSubmit={onPaymentSubmit}
                />
              )}
              {step === 2 && userInfo && (
                <div className="max-w-2xl mx-auto mt-4 mb-4">
                  <Card className="bg-background">
                    <CardHeader>
                      <CardTitle className="text-base font-bold">Review Your Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SignUpSummary userInfo={userInfo} ANNUAL_LABEL={ANNUAL_LABEL} />
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
