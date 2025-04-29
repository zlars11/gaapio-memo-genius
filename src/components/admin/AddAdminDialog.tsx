
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddAdminDialog({ open, onOpenChange, onSuccess }: AddAdminDialogProps) {
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAdding(true);
      
      // Check if user exists by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newAdminEmail)
        .maybeSingle();
      
      if (userError) {
        console.error("Error checking user existence:", userError);
        throw new Error("Failed to check if user exists");
      }
      
      if (!userData) {
        toast({
          title: "User not found",
          description: "No user with this email exists in the system. They need to sign up first.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if user is already an admin
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userData.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (roleCheckError) {
        console.error("Error checking existing role:", roleCheckError);
        throw new Error("Failed to check existing admin role");
      }
      
      if (existingRole) {
        toast({
          title: "Already an admin",
          description: "This user already has admin privileges.",
          variant: "destructive",
        });
        return;
      }
      
      // Add admin role to user
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userData.id, role: 'admin' });
      
      if (insertError) {
        console.error("Error adding admin role:", insertError);
        throw new Error("Failed to grant admin privileges");
      }
      
      toast({
        title: "Admin added",
        description: `${newAdminEmail} has been granted admin access.`,
      });
      
      setNewAdminEmail("");
      onOpenChange(false);
      onSuccess(); // Refresh the list
      
    } catch (error: any) {
      console.error("Error in handleAddAdmin:", error);
      toast({
        title: "Failed to add admin",
        description: error.message || "An error occurred while trying to add the admin user.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm mb-4">
            Enter the email of a user who should receive admin privileges.
            The user must already have an account in the system.
          </p>
          <Input 
            placeholder="user@example.com" 
            value={newAdminEmail} 
            onChange={(e) => setNewAdminEmail(e.target.value)}
            disabled={adding}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={adding}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddAdmin}
            disabled={adding}
          >
            {adding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              'Add Admin'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
