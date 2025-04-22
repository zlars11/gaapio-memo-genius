
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
                    {userInfo && <InfoSummary />}
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
                <form
                  className="max-w-2xl mx-auto space-y-6 p-6 rounded-lg bg-muted/40"
                  onSubmit={infoForm.handleSubmit(onInfoSubmit)}
                  autoComplete="off"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...infoForm.register("firstName", { required: true })} disabled={isLoading} />
                      {infoForm.formState.errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...infoForm.register("lastName", { required: true })} disabled={isLoading} />
                      {infoForm.formState.errors.lastName && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...infoForm.register("email", {
                        required: "Email is required",
                        pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                      })}
                      disabled={isLoading}
                    />
                    {infoForm.formState.errors.email && <p className="text-red-500 text-xs mt-1">{infoForm.formState.errors.email.message as string}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...infoForm.register("phone", { required: true })} disabled={isLoading} />
                    {infoForm.formState.errors.phone && <p className="text-red-500 text-xs mt-1">Phone is required</p>}
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" {...infoForm.register("company", { required: true })} disabled={isLoading} />
                    {infoForm.formState.errors.company && <p className="text-red-500 text-xs mt-1">Company is required</p>}
                  </div>
                  {/* Only Annual Plan is offered */}
                  <div>
                    <Card className="my-6 border-primary shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl">Annual Subscription</CardTitle>
                        <CardDescription>per year (save 30%)</CardDescription>
                        <div className="mt-4">
                          <span className="text-4xl font-bold">{ANNUAL_LABEL}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            Unlimited AI-generated memos
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            Up to 3 users
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            Free premium templates
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            Team collaboration tools
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            API access
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          size="lg"
                          className="w-full"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Subscribe Now"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </form>
              )}
              {step === 2 && (
                <form
                  className="max-w-2xl mx-auto space-y-6 p-6 rounded-lg bg-muted/40"
                  onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                  autoComplete="off"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
                    <p className="text-muted-foreground mb-4">Please enter your payment information below.</p>
                    {/* In a real app, use Stripe Elements or a payment integration! */}
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" {...paymentForm.register("cardNumber", { required: true })} placeholder="1234 5678 9012 3456" disabled={isLoading} maxLength={19} />
                      {paymentForm.formState.errors.cardNumber && <p className="text-red-500 text-xs mt-1">Card number is required</p>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="cardExpiry">Expiry</Label>
                        <Input id="cardExpiry" {...paymentForm.register("cardExpiry", { required: true })} placeholder="MM/YY" disabled={isLoading} maxLength={5} />
                        {paymentForm.formState.errors.cardExpiry && <p className="text-red-500 text-xs mt-1">Expiry is required</p>}
                      </div>
                      <div>
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input id="cardCvc" {...paymentForm.register("cardCvc", { required: true })} placeholder="CVC" disabled={isLoading} maxLength={4} />
                        {paymentForm.formState.errors.cardCvc && <p className="text-red-500 text-xs mt-1">CVC is required</p>}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Label htmlFor="billingZip">Billing ZIP/Postal Code</Label>
                      <Input id="billingZip" {...paymentForm.register("billingZip", { required: true })} placeholder="ZIP/Postal" disabled={isLoading} maxLength={10} />
                      {paymentForm.formState.errors.billingZip && <p className="text-red-500 text-xs mt-1">Billing ZIP is required</p>}
                    </div>
                  </div>
                  <Button size="lg" className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Processing Payment..." : "Complete Purchase"}
                  </Button>
                </form>
              )}
              {step === 2 && userInfo && (
                <div className="max-w-2xl mx-auto mt-4 mb-4">
                  <Card className="bg-background">
                    <CardHeader>
                      <CardTitle className="text-base font-bold">Review Your Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InfoSummary />
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
