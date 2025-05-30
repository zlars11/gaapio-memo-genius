
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface Props {
  isLoading: boolean;
  infoForm: any;
  onSubmit: (data: any) => void;
  ANNUAL_LABEL: string;
  plan: string;
  term: string;
}

// Improved yearly/plan selector. We lock term to annual for self sign up.
// But plan is chosen by props.
export function SignUpInfoForm({ isLoading, infoForm, onSubmit, ANNUAL_LABEL, plan, term }: Props) {
  // Features by plan
  const userLabel = plan === "emerging"
    ? "Up to 3 users"
    : plan === "mid"
      ? "Up to 6 users"
      : plan === "enterprise"
        ? "Unlimited users"
        : "";

  const getPlanObject = (planId: string) => {
    if (planId === "emerging") {
      return { label: "Emerging" }; // Removed "Annual"
    } else if (planId === "mid") {
      return { label: "Mid-Market" }; // Removed "Annual"
    } else if (planId === "enterprise") {
      return { label: "Enterprise" }; // Removed "Annual"
    }
    return { label: "Plan" };
  };

  // For self-serve sign-up, term is always annual.
  return (
    <form
      className="max-w-2xl mx-auto space-y-6 p-6 rounded-lg bg-muted/40"
      onSubmit={infoForm.handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" {...infoForm.register("firstName", { required: true })} disabled={isLoading} />
          {infoForm.formState.errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" {...infoForm.register("lastName", { required: true })} disabled={isLoading} />
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

      <div>
        <Card className="my-6 border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {plan ? `${getPlanObject(plan)?.label} Subscription` : "Subscription"}
            </CardTitle>
            <div className="mt-4">
              <span 
                className="text-4xl font-bold" 
                dangerouslySetInnerHTML={{ __html: ANNUAL_LABEL }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {/* Users at TOP */}
              {userLabel && (
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  {userLabel}
                </li>
              )}
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Unlimited AI-generated memos
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Free premium templates
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Internal approvals
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
      <input type="hidden" {...infoForm.register("plan")} value={plan || "emerging"} />
      <input type="hidden" {...infoForm.register("term")} value={term || "annual"} />
      <input type="hidden" {...infoForm.register("amount")} value={ANNUAL_LABEL} />
    </form>
  );
}
