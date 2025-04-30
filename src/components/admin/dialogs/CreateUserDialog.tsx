
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export interface CreateUserFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (password: string) => Promise<boolean>;
  pendingEmail?: string;
  isLoading: boolean;
  onCancel: () => void;
}

export function CreateUserDialog({ 
  open, 
  onOpenChange, 
  onCreateUser,
  pendingEmail,
  isLoading,
  onCancel
}: CreateUserDialogProps) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setPasswordError("");
    await onCreateUser(password);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={pendingEmail || ""}
                disabled
                className="bg-muted"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                This user doesn't exist yet. Create a password to set up this account.
              </p>
            </div>
            
            <div>
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className={passwordError ? "border-red-500" : ""}
                placeholder="Enter password"
                disabled={isLoading}
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
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
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
