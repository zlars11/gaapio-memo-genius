
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";

interface CompanyBillingFormProps {
  formData: {
    billing_first_name?: string | null;
    billing_last_name?: string | null;
    billing_email?: string | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyBillingForm({
  formData,
  onInputChange,
}: CompanyBillingFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Billing Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billing_first_name">Billing First Name</Label>
          <Input
            id="billing_first_name"
            name="billing_first_name"
            value={formData.billing_first_name || ""}
            onChange={onInputChange}
          />
        </div>
        <div>
          <Label htmlFor="billing_last_name">Billing Last Name</Label>
          <Input
            id="billing_last_name"
            name="billing_last_name"
            value={formData.billing_last_name || ""}
            onChange={onInputChange}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="billing_email">Billing Email</Label>
          <Input
            id="billing_email"
            name="billing_email"
            type="email"
            value={formData.billing_email || ""}
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="p-4 rounded-md bg-muted/60 text-foreground shadow-inner border border-muted">
        <div className="flex items-center mb-3 space-x-2">
          <CreditCard className="h-5 w-5" />
          <span className="text-sm font-semibold">Payment Details</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Payment details have been moved to the Stripe integration. Users will be redirected to Stripe Checkout for secure payment processing.
        </p>
      </div>
    </div>
  );
}
