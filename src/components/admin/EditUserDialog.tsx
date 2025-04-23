import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreditCard, X } from "lucide-react";

// Existing plan options
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
  
  // Improved payment details state with better masking
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: user.cardNumber ? maskCardNumber(user.cardNumber) : "",
    expDate: user.expDate || "",
    cvv: user.cvv ? "•••" : ""
  });

  // Function to mask card number
  function maskCardNumber(number: string) {
    if (!number) return "";
    // Remove any existing spaces
    const cleanNumber = number.replace(/\s/g, '');
    // Mask all but last 4 digits
    return cleanNumber.slice(-4).padStart(cleanNumber.length, '•');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function handlePaymentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Card number formatting
    if (name === "cardNumber") {
      // Remove non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Format with spaces every 4 digits
      formattedValue = digitsOnly
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .slice(0, 19);
    }
    
    // Expiration date formatting
    if (name === "expDate") {
      // Remove non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Format as MM/YY
      formattedValue = digitsOnly
        .slice(0, 4)
        .replace(/^(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
    }
    
    // CVV formatting
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setPaymentDetails({ ...paymentDetails, [name]: formattedValue });
  }

  function handleSave() {
    // Prepare save data, handling payment details carefully
    const saveData = { 
      ...user,
      ...fields, 
      plan, 
      term, 
      status,
      cardNumber: paymentDetails.cardNumber.replace(/\s/g, ''), // Remove spaces for storage
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
      {/* Close button */}
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstname">First Name</Label>
            <Input id="firstname" name="firstname" value={fields.firstname} onChange={handleChange} placeholder="First Name" />
          </div>
          <div>
            <Label htmlFor="lastname">Last Name</Label>
            <Input id="lastname" name="lastname" value={fields.lastname} onChange={handleChange} placeholder="Last Name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={fields.email} onChange={handleChange} placeholder="Email" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={fields.phone} onChange={handleChange} placeholder="Phone" />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" value={fields.company} onChange={handleChange} placeholder="Company" />
          </div>
          <div>
            <Label htmlFor="plan">Plan</Label>
            <select 
              id="plan" 
              name="plan" 
              value={plan} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlan(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-background text-foreground"
            >
              {PLAN_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="term">Term</Label>
            <select 
              id="term" 
              name="term" 
              value={term} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTerm(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-background text-foreground"
            >
              {TERM_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select 
              id="status" 
              name="status" 
              value={status} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-background text-foreground"
            >
              {STATUS_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          {/* Payment Info with improved input */}
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
                  onChange={handlePaymentChange}
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
                    onChange={handlePaymentChange}
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
                    onChange={handlePaymentChange}
                    type="password"
                    className="font-mono"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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
