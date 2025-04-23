
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserInfoForm } from "./forms/UserInfoForm";
import { PaymentDetailsForm } from "./forms/PaymentDetailsForm";

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
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    company: user.company,
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: user.cardNumber ? maskCardNumber(user.cardNumber) : "",
    expDate: user.expDate || "",
    cvv: user.cvv ? "•••" : ""
  });

  function maskCardNumber(number: string) {
    if (!number) return "";
    const cleanNumber = number.replace(/\s/g, '');
    return cleanNumber.slice(-4).padStart(cleanNumber.length, '•');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function handlePaymentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === "cardNumber") {
      const digitsOnly = value.replace(/\D/g, '');
      formattedValue = digitsOnly
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .slice(0, 19);
    }
    
    if (name === "expDate") {
      const digitsOnly = value.replace(/\D/g, '');
      formattedValue = digitsOnly
        .slice(0, 4)
        .replace(/^(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
    }
    
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setPaymentDetails({ ...paymentDetails, [name]: formattedValue });
  }

  function handleSave() {
    const saveData = { 
      ...user,
      ...fields, 
      plan, 
      term, 
      status,
      cardNumber: paymentDetails.cardNumber.replace(/\s/g, ''),
      expDate: paymentDetails.expDate,
      cvv: paymentDetails.cvv
    };
    
    onSave(saveData);
  }

  function confirmDelete() {
    setShowDeleteConfirm(true);
  }

  function handleDelete() {
    if (passcode === "admin123") {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      alert("Incorrect passcode.");
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
      >
        <X className="h-6 w-6" />
      </button>

      <DialogHeader className="mb-4">
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>
          Update user information and payment details.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
          <Label htmlFor="delete-passcode" className="text-destructive">Enter passcode to delete user:</Label>
          <Input
            type="password"
            id="delete-passcode"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="mt-2 border-destructive/50"
          />
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
