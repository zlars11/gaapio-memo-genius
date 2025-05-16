
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface AdminNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (firstName: string, lastName: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function AdminNameDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false
}: AdminNameDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFirstName("");
      setLastName("");
      setIsSaving(false);
    }
  }, [open]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both first and last name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const success = await onSave(firstName.trim(), lastName.trim());
      
      if (success) {
        toast({
          title: "Success",
          description: "Your name has been updated successfully",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update your name",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving admin name:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your Name</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSaving || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter your last name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSaving || isLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving || isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isLoading || !firstName.trim() || !lastName.trim()}
            >
              {isSaving || isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
