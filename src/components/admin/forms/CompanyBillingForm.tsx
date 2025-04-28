
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CompanyBillingFormProps {
  formData: {
    billing_first_name?: string | null;
    billing_last_name?: string | null;
    billing_email?: string | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  companyId: string;
}

export function CompanyBillingForm({
  formData,
  onInputChange,
  companyId,
}: CompanyBillingFormProps) {
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePayment = () => {
    setIsUpdating(true);
    
    // Normally, this would call a secure payment processor API
    // For demo purposes, we'll just simulate a successful update
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Payment details updated",
        description: "Credit card information has been securely updated.",
      });
      
      // Clear form after "successful" update
      setCardNumber("");
      setCardExpiry("");
      setCardCVV("");
    }, 1000);
  };

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

      <div className="border-t pt-6 mt-6">
        <div className="flex items-center mb-3">
          <CreditCard className="h-5 w-5 mr-2" />
          <h4 className="text-md font-medium">Payment Details</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="•••• •••• •••• ••••"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardExpiry">Expiration Date</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cardCVV">CVV</Label>
              <Input
                id="cardCVV"
                placeholder="•••"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleUpdatePayment} 
            disabled={isUpdating || !cardNumber || !cardExpiry || !cardCVV}
            className="mt-2 w-full"
          >
            {isUpdating ? "Updating..." : "Update Payment Method"}
          </Button>
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h4 className="text-md font-medium mb-4">Payment History</h4>
        <div className="bg-muted/60 p-4 rounded text-center text-muted-foreground">
          <p>Payment history will be displayed here when available.</p>
          <p className="text-sm mt-1">No payment records found for this company.</p>
        </div>
      </div>
    </div>
  );
}
