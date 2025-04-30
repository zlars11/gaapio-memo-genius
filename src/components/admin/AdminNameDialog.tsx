
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";

interface AdminNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (firstName: string, lastName: string, email: string) => Promise<boolean>;
  isLoading: boolean;
}

export function AdminNameDialog({ open, onOpenChange, onSave, isLoading }: AdminNameDialogProps) {
  const { currentUser } = useCurrentAdmin();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFirstName("");
      setLastName("");
      setEmail(currentUser.email || "");
      setError(null);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Submit data
    try {
      const success = await onSave(firstName, lastName, email);
      if (success) {
        handleOpenChange(false);
      }
    } catch (err) {
      console.error("Error saving name:", err);
      setError("An error occurred while saving your information");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Your Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="font-medium">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-medium">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading || !!currentUser.email}
            />
            {currentUser.email && (
              <p className="text-xs text-muted-foreground">Email is linked to your account and cannot be changed here.</p>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 text-sm pt-1">
              {error}
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
