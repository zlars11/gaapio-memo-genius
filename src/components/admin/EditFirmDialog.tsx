
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaymentDetailsForm } from "./forms/PaymentDetailsForm";
import { FirmSignup } from "./types/userTypes";
import { validateCardNumber, validateExpiryDate, validateCVV, formatCardNumber, formatExpiryDate } from "@/utils/cardValidation";

interface EditFirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<FirmSignup>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
}

export function EditFirmDialog({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSave,
}: EditFirmDialogProps) {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  
  const [validation, setValidation] = useState({
    cardNumberValid: true,
    expDateValid: true,
    cvvValid: true
  });
  
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setPaymentDetails({
      cardNumber: '',
      expDate: '',
      cvv: ''
    });
  }, [formData]);
  
  useEffect(() => {
    // Update validation state
    setValidation({
      cardNumberValid: paymentDetails.cardNumber.trim() === '' || validateCardNumber(paymentDetails.cardNumber),
      expDateValid: paymentDetails.expDate.trim() === '' || validateExpiryDate(paymentDetails.expDate),
      cvvValid: paymentDetails.cvv.trim() === '' || validateCVV(paymentDetails.cvv)
    });
  }, [paymentDetails]);
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    }
    
    if (name === "expDate") {
      formattedValue = formatExpiryDate(value);
    }
    
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setPaymentDetails({ ...paymentDetails, [name]: formattedValue });
  };
  
  const handleSaveClick = () => {
    setShowValidation(true);
    
    if (validation.cardNumberValid && validation.expDateValid && validation.cvvValid) {
      onSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              name="company"
              value={formData.company || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name || ''}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name || ''}
                onChange={onInputChange}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={formData.phone || ''}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={onInputChange}
              rows={3}
            />
          </div>
          
          <PaymentDetailsForm 
            paymentDetails={paymentDetails}
            validation={validation}
            onPaymentChange={handlePaymentChange}
            showValidation={showValidation}
          />
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveClick}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
