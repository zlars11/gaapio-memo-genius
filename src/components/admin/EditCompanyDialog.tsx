
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Company } from "./types/companyTypes";
import { UserSignup } from "./types/userTypes";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CompanyDetailsForm } from "./forms/CompanyDetailsForm";
import { CompanyUsersForm } from "./forms/CompanyUsersForm";
import { CompanyBillingForm } from "./forms/CompanyBillingForm";
import { DeleteCompanyDialog } from "./dialogs/DeleteCompanyDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface EditCompanyDialogProps {
  company: Company;
  onSave: () => void;
  onClose: () => void;
}

export function EditCompanyDialog({ company, onSave, onClose }: EditCompanyDialogProps) {
  const [formData, setFormData] = useState<Partial<Company>>({...company});
  const [users, setUsers] = useState<UserSignup[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editUser, setEditUser] = useState<UserSignup | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserSignup>>({
    company_id: company.id,
    company: company.name,
    plan: company.plan,
    status: 'active',
    role: 'member',
    is_active: true
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { toast } = useToast();
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expDate: formData.expDate || "",
    cvv: "",
    cardNumberLast4: company.cardNumberLast4
  });

  useEffect(() => {
    fetchUsers();
  }, [company.id]);

  async function fetchUsers() {
    setLoadingUsers(true);
    try {
      console.log("Fetching users for company_id:", company.id);
      const { data, error } = await supabase
        .from("user_signups")
        .select("*")
        .eq("company_id", company.id);

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      console.log("Fetched users:", data);
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

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
      // Ensure all required fields are present
      const userToCreate = {
        ...newUser,
        // Set defaults for required fields if they're not provided
        amount: newUser.amount || "0.00",
        company: newUser.company || company.name,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        phone: newUser.phone || "",
        plan: newUser.plan || company.plan,
        signupdate: new Date().toISOString(),
        type: "user",
        status: newUser.status || "active",
        is_active: true,
        company_id: company.id // Ensure company_id is set correctly
      };

      console.log("Creating new user:", userToCreate);
      const { error } = await supabase
        .from("user_signups")
        .insert([userToCreate]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User created successfully"
      });
      
      setCreateUserDialogOpen(false);
      setNewUser({
        company_id: company.id,
        company: company.name,
        plan: company.plan,
        status: 'active',
        role: 'member',
        is_active: true
      });
      
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

  const handleEditUser = (user: UserSignup) => {
    setEditUser(user);
    setUserDialogOpen(true);
  };

  const handleSaveUser = async (updatedUser: UserSignup) => {
    try {
      const { error } = await supabase
        .from("user_signups")
        .update(updatedUser)
        .eq("id", updatedUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      
      await fetchUsers();
      setUserDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_signups")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      
      await fetchUsers();
      setUserDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
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

  const handleDeleteCompany = async () => {
    if (deletePassword !== "admin123") {
      setDeleteError("Incorrect password");
      return;
    }
    
    try {
      // First delete all users associated with this company
      const { error: usersDeleteError } = await supabase
        .from("user_signups")
        .delete()
        .eq("company_id", company.id);
      
      if (usersDeleteError) throw usersDeleteError;
      
      // Then delete the company
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
      onSave(); // Refresh the companies list
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
            handleEditUser={handleEditUser}
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

      {/* Delete Company Dialog */}
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
