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

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Collect user info before "Subscribe"
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  // Simulate a payment processing flow
  const onInfoSubmit = (data: any) => {
    setIsLoading(true);

    // Simulate payment process with a timeout, and store all fields
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccessful(true);

      // Save signups to localStorage (simulate for admin dashboard metrics)
      const existingSignups = JSON.parse(localStorage.getItem("userSignups") || "[]");
      existingSignups.push({
        ...data,
        plan: "annual",
        amount: "$2,499",
        signupDate: new Date().toISOString()
      });
      localStorage.setItem("userSignups", JSON.stringify(existingSignups));

      toast({
        title: "Payment successful!",
        description: "Thank you for subscribing to Gaapio.",
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <ResponsiveContainer>
          {paymentSuccessful ? (
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
              {showForm && (
                <form
                  className="max-w-2xl mx-auto space-y-6 p-6 rounded-lg bg-muted/40"
                  onSubmit={handleSubmit(onInfoSubmit)}
                  autoComplete="off"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...register("firstName", { required: true })} disabled={isLoading} />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...register("lastName", { required: true })} disabled={isLoading} />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                      })}
                      disabled={isLoading}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone", { required: true })} disabled={isLoading} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">Phone is required</p>}
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" {...register("company", { required: true })} disabled={isLoading} />
                    {errors.company && <p className="text-red-500 text-xs mt-1">Company is required</p>}
                  </div>
                  {/* You'd insert Stripe payment form here in a real integration */}
                  <div>
                    <Card className="my-6 border-primary shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl">Annual Subscription</CardTitle>
                        <CardDescription>per year (save 30%)</CardDescription>
                        <div className="mt-4">
                          <span className="text-4xl font-bold">$2,499</span>
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
            </>
          )}
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
