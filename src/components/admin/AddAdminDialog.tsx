
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddAdminForm } from "./forms/AddAdminForm";
import { CreateUserDialog } from "./dialogs/CreateUserDialog";
import { useAdminDialogActions } from "@/utils/adminDialogUtils";
import { AdminFormValues } from "@/types/adminTypes";
import { useToast } from "@/components/ui/use-toast";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<any>;
}

export function AddAdminDialog({ open, onOpenChange, onSuccess }: AddAdminDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [pendingValues, setPendingValues] = useState<AdminFormValues | null>(null);
  
  const { handleAddAdminRole, handleCreateUserWithAdminRole } = useAdminDialogActions();
  const { toast } = useToast();

  // Handle adding an admin
  const handleSubmit = async (values: AdminFormValues) => {
    try {
      setIsLoading(true);
      
      const result = await handleAddAdminRole(values);
      
      if (result.success) {
        // Successfully added admin role
        await onSuccess();
        onOpenChange(false);
      } else if (result.needsUserCreation) {
        // User doesn't exist, need to create first
        setPendingValues(values);
        setShowCreateUser(true);
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error adding admin",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle user creation
  const handleCreateUser = async (password: string) => {
    if (!pendingValues) return false;
    
    try {
      setIsLoading(true);
      
      const success = await handleCreateUserWithAdminRole({
        email: pendingValues.email,
        password,
        firstName: pendingValues.firstName || "Admin",
        lastName: pendingValues.lastName || "User"
      });
      
      if (success) {
        await onSuccess();
        setShowCreateUser(false);
        onOpenChange(false);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error creating user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showCreateUser} onOpenChange={(isOpen) => {
        if (!isLoading) {
          onOpenChange(isOpen);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
          </DialogHeader>
          <AddAdminForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      
      <CreateUserDialog
        open={showCreateUser}
        onOpenChange={(isOpen) => {
          if (!isLoading) {
            setShowCreateUser(isOpen);
            if (!isOpen) onOpenChange(false);
          }
        }}
        onCreateUser={handleCreateUser}
        pendingEmail={pendingValues?.email}
        isLoading={isLoading}
        onCancel={() => {
          setShowCreateUser(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
