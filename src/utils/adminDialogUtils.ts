
import { supabase } from "@/integrations/supabase/client";
import { addAdminRole } from "@/utils/adminRoleUtils";
import { findUserByEmail } from "@/utils/adminUtils";
import { useToast } from "@/components/ui/use-toast";
import { AdminFormValues } from "@/types/adminTypes";

/**
 * Interface for create user form values
 */
export interface CreateUserFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Hook for managing admin user creation and role assignment
 */
export function useAdminDialogActions() {
  const { toast } = useToast();
  
  const handleCreateUserWithAdminRole = async (values: CreateUserFormValues) => {
    try {
      console.log("Creating new user with admin role:", values.email);
      
      // Try using admin API to create user
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          first_name: values.firstName,
          last_name: values.lastName
        }
      });
      
      if (signUpError) {
        console.error("Error creating user with admin API:", signUpError);
        toast({
          title: "Failed to create user",
          description: signUpError.message,
          variant: "destructive",
        });
        return false;
      }
      
      if (!signUpData?.user) {
        console.error("Failed to create user: No user returned");
        toast({
          title: "Failed to create user",
          description: "No user data returned from creation",
          variant: "destructive",
        });
        return false;
      }
      
      const userId = signUpData.user.id;
      console.log("User created via admin API:", userId);
      
      // Add user to admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userId,
          email: values.email,
          first_name: values.firstName || null,
          last_name: values.lastName || null,
          role: 'admin'
        });
      
      if (adminError) {
        console.error("Error adding user to admin_users:", adminError);
        toast({
          title: "Failed to assign admin privileges",
          description: adminError.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Admin user created",
        description: `${values.email} has been created and granted admin access.`,
      });
      return true;
    } catch (error: any) {
      console.error("Error in createUserWithAdminRole:", error);
      toast({
        title: "Failed to create admin user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleAddAdminRole = async (values: AdminFormValues) => {
    try {
      console.log("Finding user by email:", values.email);
      
      // First check if user exists in Auth system
      const userId = await findUserByEmail(values.email);
      
      if (!userId) {
        console.log("User not found, needs to be created");
        return { success: false, needsUserCreation: true };
      }
      
      console.log("User found in auth system:", userId);
      
      // Check if user is already in admin_users table using user_id
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking admin table:", checkError);
        toast({
          title: "Failed to check admin status",
          description: checkError.message,
          variant: "destructive",
        });
        return { success: false, needsUserCreation: false };
      }
      
      if (existingAdmin) {
        console.log("User is already in admin_users table");
        toast({
          title: "Already an admin",
          description: "This user already has admin privileges.",
        });
        return { success: true, needsUserCreation: false };
      }
      
      console.log("Adding user to admin_users table");
      
      // Insert user into admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userId,
          email: values.email,
          first_name: values.firstName || null,
          last_name: values.lastName || null,
          role: 'admin'
        });
      
      if (insertError) {
        console.error("Error inserting admin user:", insertError);
        toast({
          title: "Failed to add admin",
          description: insertError.message,
          variant: "destructive",
        });
        return { success: false, needsUserCreation: false };
      }
      
      toast({
        title: "Admin added",
        description: `${values.email} has been granted admin access.`,
      });
      return { success: true, needsUserCreation: false };
    } catch (error: any) {
      console.error("Error in handleAddAdminRole:", error);
      toast({
        title: "Failed to add admin",
        description: error.message || "An error occurred while trying to add the admin user.",
        variant: "destructive",
      });
      return { success: false, needsUserCreation: false };
    }
  };
  
  return {
    handleAddAdminRole,
    handleCreateUserWithAdminRole
  };
}
