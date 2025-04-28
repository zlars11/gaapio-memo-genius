
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CompanyDetailsForm } from "./forms/CompanyDetailsForm";
import { CompanyUsersForm } from "./forms/CompanyUsersForm";
import { CompanyBillingForm } from "./forms/CompanyBillingForm";
import { Company, CompanyPlan } from "./types/companyTypes";
import { User } from "./types/userTypes";
import { useCompanyDialog } from "./hooks/useCompanyDialog";
import { NormalizedUser } from "./types/normalizedTypes";

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
    handleInputChange,
    handlePlanChange,
    handleStatusChange,
    setEditUser,
    setUserDialogOpen,
    setCreateUserDialogOpen,
    fetchUsers,
    newUser,
    setNewUser,
    handleCreateUser,
    handleEditUser,
    handleSaveUser,
    handleDeleteUser
  } = useCompanyDialog(company);

  // Fetch users when the dialog opens
  useEffect(() => {
    if (company.id) {
      fetchUsers(company.id);
    }
  }, [company.id]);

  const handleSaveCompany = async () => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: formData.name,
          plan: formData.plan,
          status: formData.status,
          amount: formData.amount,
          user_limit: formData.user_limit,
          billing_contact: formData.billing_contact,
          billing_email: formData.billing_email,
          billing_frequency: formData.billing_frequency
        })
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

  return (
    <div className="p-6 space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{company.name}</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Company Details</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <CompanyDetailsForm 
            formData={formData} 
            onInputChange={handleInputChange}
            onPlanChange={handlePlanChange}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="billing">
          <CompanyBillingForm 
            formData={formData} 
            onInputChange={handleInputChange}
            companyId={company.id}
          />
        </TabsContent>

        <TabsContent value="users">
          <CompanyUsersForm
            users={users as NormalizedUser[]}
            companyId={company.id}
            companyName={company.name}
            companyPlan={company.plan}
            loadingUsers={loadingUsers}
            createUserDialogOpen={createUserDialogOpen}
            setCreateUserDialogOpen={setCreateUserDialogOpen}
            newUser={newUser}
            setNewUser={setNewUser}
            handleCreateUser={handleCreateUser}
            editUser={editUser as NormalizedUser | null}
            userDialogOpen={userDialogOpen}
            setUserDialogOpen={setUserDialogOpen}
            setEditUser={setEditUser}
            handleEditUser={handleEditUser}
            handleSaveUser={handleSaveUser}
            handleDeleteUser={handleDeleteUser}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveCompany}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
