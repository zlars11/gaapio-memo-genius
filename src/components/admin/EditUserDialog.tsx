import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Add Plan, Term, Status options
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

export default function EditUserDialog({ user, onSave, onDelete, ...props }: any) {
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

  function handleChange(e: any) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function handlePlanChange(e: any) {
    setPlan(e.target.value);
  }

  function handleTermChange(e: any) {
    setTerm(e.target.value);
  }

  function handleStatusChange(e: any) {
    setStatus(e.target.value);
  }

  function handleSave() {
    // Call onSave with all values, including plan/term/status
    onSave({ ...fields, plan, term, status });
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
    <div>
      <form>
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
            <select id="plan" name="plan" value={plan} onChange={handlePlanChange} className="w-full border rounded px-3 py-2 bg-background text-foreground">
              {PLAN_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="term">Term</Label>
            <select id="term" name="term" value={term} onChange={handleTermChange} className="w-full border rounded px-3 py-2 bg-background text-foreground">
              {TERM_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" value={status} onChange={handleStatusChange} className="w-full border rounded px-3 py-2 bg-background text-foreground">
              {STATUS_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* Payment Info Display */}
          <div className="p-4 mt-4 rounded-md bg-muted/60 text-foreground shadow-inner border border-muted">
            <div className="text-sm font-semibold mb-2">Payment Details</div>
            <div>
              <span className="font-medium">Amount:</span>{" "}
              {user.amount ? <span>{user.amount}</span> : <span className="text-muted-foreground">—</span>}
            </div>
            <div>
              <span className="font-medium">Term:</span>{" "}
              {user.term ? <span className="capitalize">{user.term}</span> : <span className="text-muted-foreground">—</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <Button type="button" onClick={handleSave}>Save</Button>
          <Button type="button" variant="destructive" onClick={confirmDelete}>Delete User</Button>
        </div>
      </form>
      {showDeleteConfirm && (
        <div className="mt-4">
          <Label htmlFor="delete-passcode">Enter passcode to delete user:</Label>
          <Input
            type="password"
            id="delete-passcode"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="mt-2"
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
