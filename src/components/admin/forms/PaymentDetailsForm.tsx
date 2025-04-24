
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { validateCardNumber, validateExpiryDate, validateCVV } from "@/utils/cardValidation";

interface PaymentDetailsFormProps {
  paymentDetails: {
    cardNumber: string;
    expDate: string;
    cvv: string;
  };
  validation?: {
    cardNumberValid: boolean;
    expDateValid: boolean;
    cvvValid: boolean;
  };
  onPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showValidation?: boolean;
}

export function PaymentDetailsForm({ 
  paymentDetails, 
  validation, 
  onPaymentChange,
  showValidation = false
}: PaymentDetailsFormProps) {
  // Only show validation if explicitly requested and field is not empty
  const showCardNumberError = showValidation && 
    paymentDetails.cardNumber.trim() !== "" && 
    validation && !validation.cardNumberValid;
  
  const showExpDateError = showValidation && 
    paymentDetails.expDate.trim() !== "" && 
    validation && !validation.expDateValid;
  
  const showCvvError = showValidation && 
    paymentDetails.cvv.trim() !== "" && 
    validation && !validation.cvvValid;

  return (
    <div className="p-4 mt-4 rounded-md bg-muted/60 text-foreground shadow-inner border border-muted">
      <div className="flex items-center mb-3 space-x-2">
        <CreditCard className="h-5 w-5" />
        <span className="text-sm font-semibold">Payment Details</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="cardNumber" className={showCardNumberError ? "text-destructive" : ""}>Card Number</Label>
          <Input 
            id="cardNumber"
            name="cardNumber"
            placeholder="•••• •••• •••• ••••"
            value={paymentDetails.cardNumber}
            onChange={onPaymentChange}
            className={`font-mono ${showCardNumberError ? "border-destructive" : ""}`}
          />
          {showCardNumberError && (
            <p className="text-xs text-destructive mt-1">
              Please enter a valid card number (13-19 digits)
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="expDate" className={showExpDateError ? "text-destructive" : ""}>Expiration Date</Label>
            <Input 
              id="expDate"
              name="expDate"
              placeholder="MM/YY"
              value={paymentDetails.expDate}
              onChange={onPaymentChange}
              className={`font-mono ${showExpDateError ? "border-destructive" : ""}`}
              maxLength={5}
            />
            {showExpDateError && (
              <p className="text-xs text-destructive mt-1">
                Enter valid future date (MM/YY)
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="cvv" className={showCvvError ? "text-destructive" : ""}>CVV</Label>
            <Input 
              id="cvv"
              name="cvv"
              placeholder="•••"
              value={paymentDetails.cvv}
              onChange={onPaymentChange}
              type="text" // Changed from password to enable validation
              inputMode="numeric"
              className={`font-mono ${showCvvError ? "border-destructive" : ""}`}
              maxLength={4}
            />
            {showCvvError && (
              <p className="text-xs text-destructive mt-1">
                Enter 3-4 digits
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground px-1">
          <div className="border border-dashed border-muted-foreground/40 p-2 rounded-sm">
            Stripe integration placeholder – use to securely tokenize and process card info later
          </div>
        </div>
      </div>
    </div>
  );
}
