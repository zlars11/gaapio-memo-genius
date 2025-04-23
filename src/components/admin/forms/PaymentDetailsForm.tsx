
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentDetailsFormProps {
  paymentDetails: {
    cardNumber: string;
    expDate: string;
    cvv: string;
  };
  onPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PaymentDetailsForm({ paymentDetails, onPaymentChange }: PaymentDetailsFormProps) {
  return (
    <div className="p-4 mt-4 rounded-md bg-muted/60 text-foreground shadow-inner border border-muted">
      <div className="flex items-center mb-3 space-x-2">
        <CreditCard className="h-5 w-5" />
        <span className="text-sm font-semibold">Payment Details</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber"
            name="cardNumber"
            placeholder="•••• •••• •••• ••••"
            value={paymentDetails.cardNumber}
            onChange={onPaymentChange}
            className="font-mono"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="expDate">Expiration Date</Label>
            <Input 
              id="expDate"
              name="expDate"
              placeholder="MM/YY"
              value={paymentDetails.expDate}
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
              type="password"
              className="font-mono"
              maxLength={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
