
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserInfoForm } from "./forms/UserInfoForm";
import { PaymentDetailsForm } from "./forms/PaymentDetailsForm";
import { validateCardNumber, validateExpiryDate, validateCVV, formatCardNumber, formatExpiryDate } from "@/utils/cardValidation";
import { getCSRFToken } from "@/utils/securityUtils";

// Plan options moved to constants
const PLAN_OPTIONS = [
  { value: "emerging", label: "Emerging" },
  { value: "mid", label: "Mid" },
  { value: "enterprise", label: "Enterprise" },
];

const TERM_OPTIONS = [
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "trial", label: "Trial" },
];

interface EditUserDialogProps {
  user: any;
  onSave: (user: any) => void;
  onDelete: () => void;
  onClose?: () => void;
}

export default function EditUserDialog({ user, onSave, onDelete, onClose }: EditUserDialogProps) {
  const [plan, setPlan] = useState(user.plan || "emerging");
  const [term, setTerm] = useState(user.term || "annual");
  const [status, setStatus] = useState(user.status || "active");
  const [passcode, setPasscode] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fields, setFields] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    company: user.company || "",
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: user.cardNumber ? maskCardNumber(user.cardNumber) : "",
    expDate: user.expDate || "",
    cvv: user.cvv ? "•••" : ""
  });
  
  const [validation, setValidation] = useState({
    cardNumberValid: true,
    expDateValid: true,
    cvvValid: true
  });
  
  const [showValidation, setShowValidation] = useState(false);
  
  // Track if card fields have been modified
  const [cardFieldsModified, setCardFieldsModified] = useState({
    cardNumber: false,
    expDate: false,
    cvv: false
  });
  
  // CSRF token for form submissions
  const [csrfToken] = useState(() => getCSRFToken());

  useEffect(() => {
    // Update validation state
    setValidation({
      cardNumberValid: 
        !cardFieldsModified.cardNumber || 
        paymentDetails.cardNumber === "" || 
        validateCardNumber(paymentDetails.cardNumber),
      expDateValid: 
        !cardFieldsModified.expDate || 
        paymentDetails.expDate === "" || 
        validateExpiryDate(paymentDetails.expDate),
      cvvValid: 
        !cardFieldsModified.cvv || 
        paymentDetails.cvv === "" || 
        paymentDetails.cvv === "•••" || 
        validateCVV(paymentDetails.cvv)
    });
  }, [paymentDetails, cardFieldsModified]);

  function maskCardNumber(number: string) {
    if (!number) return "";
    const cleanNumber = number.replace(/\s/g, '');
    return cleanNumber.slice(-4).padStart(cleanNumber.length, '•').replace(/(.{4})(?=.)/g, '$1 ');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function handlePaymentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Track that this field has been modified
    setCardFieldsModified(prev => ({
      ...prev,
      [name]: true
    }));
    
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
  }

  function handleSave() {
    setShowValidation(true);
    
    if (!validation.cardNumberValid || !validation.expDateValid || !validation.cvvValid) {
      return;
    }
    
    const saveData = { 
      ...user,
      ...fields, 
      plan, 
      term, 
      status,
      _csrf: csrfToken // Add CSRF token to the request
    };
    
    // Only update card fields if they've been modified
    if (cardFieldsModified.cardNumber && paymentDetails.cardNumber !== "•••" && paymentDetails.cardNumber !== "") {
      // In a production environment, we shouldn't store full card numbers
      // Instead, we should be using a payment processor's tokenization
      // Here we'll just store the last 4 digits for reference
      const last4 = paymentDetails.cardNumber.replace(/\s/g, '').slice(-4);
      saveData.cardNumberLast4 = last4;
      
      // Don't save the full card number
      delete saveData.cardNumber;
    }
    
    if (cardFieldsModified.expDate && paymentDetails.expDate !== "") {
      saveData.expDate = paymentDetails.expDate;
    }
    
    // Don't save CVV at all - it's a security risk
    delete saveData.cvv;
    
    onSave(saveData);
  }

  function confirmDelete() {
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    // In a real application, we should verify this server-side with a proper auth check
    onDelete();
    setShowDeleteConfirm(false);
  }

  return (
    <div className="relative">
      
      <DialogHeader className="mb-4">
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>
          Update user information and payment details.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <UserInfoForm 
          fields={fields}
          plan={plan}
          term={term}
          status={status}
          onChange={handleChange}
          onPlanChange={(e) => setPlan(e.target.value)}
          onTermChange={(e) => setTerm(e.target.value)}
          onStatusChange={(e) => setStatus(e.target.value)}
          PLAN_OPTIONS={PLAN_OPTIONS}
          TERM_OPTIONS={TERM_OPTIONS}
          STATUS_OPTIONS={STATUS_OPTIONS}
        />
        
        <PaymentDetailsForm 
          paymentDetails={paymentDetails}
          onPaymentChange={handlePaymentChange}
          validation={validation}
          showValidation={showValidation}
        />

        <div className="flex gap-3 mt-8 justify-between">
          <Button type="button" variant="destructive" onClick={confirmDelete}>
            Delete User
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="mt-4 p-4 border border-destructive/20 bg-destructive/5 rounded-md">
          <Label htmlFor="delete-passcode" className="text-destructive">Confirm user deletion:</Label>
          <div className="flex gap-2 mt-2">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
