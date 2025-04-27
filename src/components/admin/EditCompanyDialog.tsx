
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CompanyDetailsForm } from "./forms/CompanyDetailsForm";
import { CompanyUsersForm } from "./forms/CompanyUsersForm";
import { CompanyBillingForm } from "./forms/CompanyBillingForm";
import { DeleteCompanyDialog } from "./dialogs/DeleteCompanyDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useCompanyDialog } from "./hooks/useCompanyDialog";
import { Company } from "./types/companyTypes";

interface EditCompanyDialogProps {
  company: Company;
  onSave: () => void;
  onClose: () => void;
}

export function EditCompanyDialog({ company, onSave, onClose }: EditCompanyDialogProps) {
  const { toast } = useToast();
  const {
    formData,
    users,
    loadingUsers,
    editUser,
    userDialogOpen,
    createUserDialogOpen,
    deleteDialogOpen,
    deletePassword,
    deleteError,
    paymentDetails,
    newUser,
    setEditUser,
    setUserDialogOpen,
    setCreateUserDialogOpen,
    setDeleteDialogOpen,
    setDeletePassword,
    setDeleteError,
    setNewUser,
    normalizeUser,
    fetchUsers,
    handleInputChange,
    handlePaymentChange
  } = useCompanyDialog(company, onSave);

  useEffect(() => {
    fetchUsers();
  }, [company.id]);

  const handleCreateUser = async () => {
    if (!newUser.firstname || !newUser.lastname || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const userToCreate = normalizeUser({
        id: newUser.id || "",
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        phone: newUser.phone || "",
        company: newUser.company || company.name,
        company_id: company.id,
        plan: newUser.plan || company.plan,
        status: newUser.status || "active",
        amount: newUser.amount || "0.00",
        is_active: true,
        type: "user"
      });

      const { error } = await supabase
        .from("users")
        .insert([userToCreate]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User created successfully"
      });
      
      setCreateUserDialogOpen(false);
      await fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: `Failed to create user: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  };

  const handleSaveCompany = async () => {
    try {
      const updateData: any = {
        name: formData.name,
        plan: formData.plan,
        user_limit: formData.user_limit,
        billing_email: formData.billing_email,
        status: formData.status,
        billing_first_name: formData.billing_first_name,
        billing_last_name: formData.billing_last_name
      };
      
      if (paymentDetails.cardNumber && paymentDetails.cardNumber !== "") {
        const last4 = paymentDetails.cardNumber.replace(/\s/g, '').slice(-4);
        updateData.cardNumberLast4 = last4;
      }
      
      if (paymentDetails.expDate) {
        updateData.expDate = paymentDetails.expDate;
      }
      
      const { error } = await supabase
        .from("companies")
        .update(updateData)
        .eq("id", company.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Company information updated successfully"
      });
      
      onSave();
    } catch (error) {
      console.error("Error updating company:", error);
      toast({
        title: "Error",
        description: "Failed to update company information",
        variant: "destructive"
      });
    }
  };

  const handleSaveUser = async (updatedUser: any) => {
    try {
      const { error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("id", updatedUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully"
      });

      await fetchUsers();
      setUserDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully"
      });

      await fetchUsers();
      setUserDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCompany = async () => {
    if (deletePassword !== "admin123") {
      setDeleteError("Incorrect password");
      return;
    }
    
    try {
      const { error: usersDeleteError } = await supabase
        .from("users")
        .delete()
        .eq("company_id", company.id);
      
      if (usersDeleteError) throw usersDeleteError;
      
      const { error: companyDeleteError } = await supabase
        .from("companies")
        .delete()
        .eq("id", company.id);
      
      if (companyDeleteError) throw companyDeleteError;
      
      toast({
        title: "Success",
        description: "Company and all associated users deleted successfully"
      });
      
      setDeleteDialogOpen(false);
      onClose();
      onSave();
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{company.name}</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Company Details</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <CompanyDetailsForm 
            formData={formData} 
            onInputChange={handleInputChange}
          />
        </TabsContent>

        <TabsContent value="users">
          <CompanyUsersForm
            users={users}
            companyId={company.id}
            companyName={company.name}
            companyPlan={company.plan}
            onUserUpdate={fetchUsers}
            loadingUsers={loadingUsers}
            createUserDialogOpen={createUserDialogOpen}
            setCreateUserDialogOpen={setCreateUserDialogOpen}
            newUser={newUser}
            setNewUser={setNewUser}
            handleCreateUser={handleCreateUser}
            handleEditUser={(user) => {
              setEditUser(normalizeUser(user));
              setUserDialogOpen(true);
            }}
            handleSaveUser={handleSaveUser}
            handleDeleteUser={handleDeleteUser}
            editUser={editUser}
            userDialogOpen={userDialogOpen}
            setUserDialogOpen={setUserDialogOpen}
          />
        </TabsContent>

        <TabsContent value="billing">
          <CompanyBillingForm
            formData={formData}
            paymentDetails={paymentDetails}
            onInputChange={handleInputChange}
            onPaymentChange={handlePaymentChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between gap-3 pt-4 border-t">
        <Button 
          variant="destructive" 
          onClick={() => setDeleteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" /> Delete Company
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveCompany}>
            Save Changes
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen}>
        <DeleteCompanyDialog
          deletePassword={deletePassword}
          deleteError={deleteError}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteCompany}
          onPasswordChange={setDeletePassword}
        />
      </AlertDialog>
    </div>
  );
}
