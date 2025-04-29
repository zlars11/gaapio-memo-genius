
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateUserDialog, CreateUserFormValues } from "./dialogs/CreateUserDialog";
import { AddAdminForm, AddAdminFormValues } from "./forms/AddAdminForm";
import { useAdminDialogActions } from "./utils/adminDialogUtils";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddAdminDialog({ open, onOpenChange, onSuccess }: AddAdminDialogProps) {
  const [adding, setAdding] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<AddAdminFormValues>({
    email: "",
    firstName: "",
    lastName: "",
  });
  
  const { handleAddAdminRole, handleCreateUserWithAdminRole } = useAdminDialogActions();
  const { toast } = useToast();

  // Reset dialog state when it opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormValues({
        email: "",
        firstName: "",
        lastName: "",
      });
    }
    onOpenChange(open);
  };

  // Handle form submission for adding an admin
  const handleAddAdmin = async (values: AddAdminFormValues) => {
    try {
      setAdding(true);
      setFormValues(values); // Store values in case we need to create a user
      
      const result = await handleAddAdminRole(values);
      
      if (result.success) {
        handleOpenChange(false);
        onSuccess(); // Refresh the list
        return;
      }
      
      if (result.needsUserCreation) {
        setCreateUserDialogOpen(true);
      }
      
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

  // Handle creating a new user and making them an admin
  const handleCreateUserAccount = async (values: CreateUserFormValues) => {
    console.log("Adding user with admin role:", values);
    try {
      setAdding(true);
      
      const success = await handleCreateUserWithAdminRole(values);
      console.log("User creation result:", success);
      
      if (success) {
        setCreateUserDialogOpen(false);
        handleOpenChange(false);
        onSuccess(); // Refresh the list
        toast({
          title: "Success",
          description: `Created user ${values.email} and added admin privileges.`,
        });
      } else {
        throw new Error("Failed to create user with admin role.");
      }
    } catch (error: any) {
      console.error("Error in createUserAccount:", error);
      toast({
        title: "Failed to create admin user",
        description: error.message || "An error occurred while creating the admin user.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  // Check current route and populate default values for Jace
  React.useEffect(() => {
    if (open && window.location.pathname.includes("/admin")) {
      setFormValues({
        email: "jacewchambers@gmail.com",
        firstName: "Jace",
        lastName: "Chambers",
      });
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          
          <AddAdminForm 
            onSubmit={handleAddAdmin}
            onCancel={() => handleOpenChange(false)}
            isLoading={adding}
            defaultValues={{
              email: formValues.email,
              firstName: formValues.firstName || "",
              lastName: formValues.lastName || "",
            }}
          />
        </DialogContent>
      </Dialog>

      <CreateUserDialog 
        open={createUserDialogOpen} 
        onOpenChange={setCreateUserDialogOpen}
        defaultValues={{
          email: formValues.email || "",
          firstName: formValues.firstName || "",
          lastName: formValues.lastName || ""
        }}
        isLoading={adding}
        onSubmit={handleCreateUserAccount}
      />
    </>
  );
}
