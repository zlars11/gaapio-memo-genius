import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface UserSignup {
  id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  company?: string;
  plan: string;
  term?: string;
  status?: string;
  amount?: string;
  signupdate?: string;
}

interface EditUserDialogProps {
  user: UserSignup;
  open: boolean;
  onClose: (changed: boolean) => void;
}

export function EditUserDialog({ user, open, onClose }: EditUserDialogProps) {
  // All user fields as state
  const [firstname, setFirstname] = useState(user.firstname || "");
  const [lastname, setLastname] = useState(user.lastname || "");
  const [email, setEmail] = useState(user.email || "");
  const [company, setCompany] = useState(user.company || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [plan, setPlan] = useState(user.plan || "Emerging");
  const [status, setStatus] = useState(user.status || "Active");
  const [amount, setAmount] = useState(user.amount || "");
  // Term defaults to 'Annual'
  const [term, setTerm] = useState(user.term || "Annual");
  const [saving, setSaving] = useState(false);
  const [deleteStep, setDeleteStep] = useState<null | "passcode">();
  const [passcode, setPasscode] = useState("");
  const [deleting, setDeleting] = useState(false);

  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    const updates: Partial<UserSignup> = {
      firstname,
      lastname,
      email,
      company,
      phone,
      plan,
      status,
      amount,
      term,
    };
    const { error } = await supabase
      .from("user_signups")
      .update(updates)
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "User updated",
        description: "The user was updated successfully.",
      });
      onClose(true);
    }
  };

  const handleDelete = async () => {
    if (passcode !== "admin123") {
      toast({
        title: "Wrong passcode",
        description: "The passcode entered is incorrect.",
        variant: "destructive",
      });
      return;
    }
    setDeleting(true);
    const { error } = await supabase
      .from("user_signups")
      .delete()
      .eq("id", user.id);
    setDeleting(false);
    if (error) {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "User deleted",
        description: "The user was deleted successfully.",
      });
      onClose(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details, payments and license info.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {/* First Name */}
          <div>
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          {/* Last Name */}
          <div>
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Company */}
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {/* Plan dropdown */}
          <div>
            <Label htmlFor="plan">Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger id="plan">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emerging">Emerging</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Term dropdown (always editable) */}
          <div>
            <Label htmlFor="term">Term</Label>
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual">Annual</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Status dropdown */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onClose(false)}
            type="button"
            disabled={saving || deleting}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || deleting} type="button">
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
        {/* Delete user section */}
        <div className="mt-6 border-t pt-4">
          {!deleteStep ? (
            <Button
              variant="destructive"
              type="button"
              className="w-full"
              disabled={saving || deleting}
              onClick={() => setDeleteStep("passcode")}
            >
              {deleting ? "Deleting..." : "Delete User"}
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-delete-passcode" className="text-red-600">
                Enter passcode to delete user
              </Label>
              <Input
                id="admin-delete-passcode"
                placeholder="Passcode"
                type="password"
                autoFocus
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                disabled={deleting}
                className="border-red-500 focus-visible:ring-destructive"
              />
              <div className="flex gap-2 mt-1">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setDeleteStep(null);
                    setPasscode("");
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || !passcode}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
