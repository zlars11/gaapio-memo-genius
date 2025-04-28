
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isLoading: boolean;
  paymentForm: any;
  onSubmit: (data: any) => void;
}

export function SignUpPaymentForm({ isLoading, paymentForm, onSubmit }: Props) {
  return (
    <form
      className="max-w-2xl mx-auto space-y-6 p-6 rounded-lg bg-muted/40"
      onSubmit={paymentForm.handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
        <p className="text-muted-foreground mb-4">Please enter your payment information below.</p>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="billingContact">Billing Contact</Label>
            <Input 
              id="billingContact"
              {...paymentForm.register("billingContact", { required: true })}
              placeholder="Contact Name"
              disabled={isLoading}
            />
            {paymentForm.formState.errors.billingContact && 
              <p className="text-red-500 text-xs mt-1">Billing contact is required</p>
            }
          </div>
          
          <div>
            <Label htmlFor="billingEmail">Billing Email</Label>
            <Input
              id="billingEmail"
              type="email"
              {...paymentForm.register("billingEmail", {
                required: "Billing email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
              })}
              placeholder="billing@example.com"
              disabled={isLoading}
            />
            {paymentForm.formState.errors.billingEmail && 
              <p className="text-red-500 text-xs mt-1">
                {paymentForm.formState.errors.billingEmail.message as string}
              </p>
            }
          </div>
        </div>

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
  );
}
