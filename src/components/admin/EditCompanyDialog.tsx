
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CompanyDetailsForm } from "./forms/CompanyDetailsForm";
import { CompanyUsersForm } from "./forms/CompanyUsersForm";
import { Company, CompanyPlan } from "./types/companyTypes";
import { User } from "./types/userTypes";
import { useCompanyDialog } from "./hooks/useCompanyDialog";

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
    setCreateUserDialogOpen
  } = useCompanyDialog(company);

  const handleSaveCompany = async () => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: formData.name,
          plan: formData.plan,
          status: formData.status,
          amount: formData.amount
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

        <TabsContent value="users">
          <CompanyUsersForm
            users={users as User[]}
            companyId={company.id}
            companyName={company.name}
            companyPlan={company.plan}
            loadingUsers={loadingUsers}
            createUserDialogOpen={createUserDialogOpen}
            setCreateUserDialogOpen={setCreateUserDialogOpen}
            editUser={editUser as User}
            userDialogOpen={userDialogOpen}
            setUserDialogOpen={setUserDialogOpen}
            setEditUser={setEditUser}
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
