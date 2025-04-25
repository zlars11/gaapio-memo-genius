
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { PaymentDetails } from "../types/userTypes";

interface CompanyBillingFormProps {
  formData: {
    billing_first_name?: string | null;
    billing_last_name?: string | null;
    billing_email?: string | null;
  };
  paymentDetails: PaymentDetails;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyBillingForm({
  formData,
  paymentDetails,
  onInputChange,
  onPaymentChange,
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder={paymentDetails.cardNumberLast4 ? `•••• •••• •••• ${paymentDetails.cardNumberLast4}` : "•••• •••• •••• ••••"}
              value={paymentDetails.cardNumber}
              onChange={onPaymentChange}
              className="font-mono"
            />
          </div>
          <div>
            <Label htmlFor="expDate">Expiration Date</Label>
            <Input
              id="expDate"
              name="expDate"
              placeholder="MM/YY"
              value={paymentDetails.expDate || ""}
              onChange={onPaymentChange}
              className="font-mono"
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              placeholder="•••"
              value={paymentDetails.cvv}
              onChange={onPaymentChange}
              className="font-mono"
              maxLength={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
