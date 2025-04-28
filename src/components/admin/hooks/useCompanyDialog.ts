
import { useState, ChangeEvent, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Company, CompanyPlan } from '../types/companyTypes';
import { User } from '../types/userTypes';
import { useToast } from '@/components/ui/use-toast';

export function useCompanyDialog(company: Partial<Company>) {
  const [formData, setFormData] = useState<Partial<Company>>({
    ...company
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const { toast } = useToast();

  const fetchUsers = async (companyId: string) => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Ensure we cast the user_type field to the correct type
      const typedUsers = data?.map(user => ({
        ...user,
        user_type: user.user_type as 'user' | 'approver' | 'admin'
      })) || [];
      
      // We now set users with the properly typed array
      setUsers(typedUsers as User[]);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle special cases for numeric fields
    if (name === 'amount') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
    } else if (name === 'user_limit') {
      setFormData(prev => ({
        ...prev,
        // Store user_limit as string (empty string will be converted to null later)
        [name]: value === '' ? null : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlanChange = (value: CompanyPlan) => {
    setFormData(prev => ({
      ...prev,
      plan: value
    }));
  };

  const handleStatusChange = (value: 'active' | 'inactive') => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleCreateUser = async () => {
    try {
      if (!company.id) {
        toast({
          title: "Error",
          description: "Company ID is required to create a user",
          variant: "destructive"
        });
        return;
      }

      // Make sure all required fields are present before inserting
      if (!newUser.email || !newUser.first_name || !newUser.last_name || !newUser.user_type) {
        toast({
          title: "Error",
          description: "Email, first name, last name, and user type are required",
          variant: "destructive"
        });
        return;
      }

      const userData = {
        company_id: company.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone || null,
        status: newUser.status || "active",
        user_type: newUser.user_type
      };

      const { error } = await supabase
        .from("users")
        .insert([userData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User created successfully"
      });
      setCreateUserDialogOpen(false);
      setNewUser({});
      fetchUsers(company.id);
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setUserDialogOpen(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          user_type: updatedUser.user_type,
          status: updatedUser.status
        })
        .eq("id", updatedUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setUserDialogOpen(false);
      if (company.id) {
        fetchUsers(company.id);
      }
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
        .from("users")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      setUserDialogOpen(false);
      if (company.id) {
        fetchUsers(company.id);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  return {
    formData,
    users,
    loadingUsers,
    editUser,
    userDialogOpen,
    createUserDialogOpen,
    handleInputChange,
    handlePlanChange,
    handleStatusChange,
    setUserDialogOpen,
    setCreateUserDialogOpen,
    setEditUser,
    fetchUsers,
    newUser,
    setNewUser,
    handleCreateUser,
    handleEditUser,
    handleSaveUser,
    handleDeleteUser
  };
}
