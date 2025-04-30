
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
 * Check if a user already has the admin role
 */
export async function checkExistingAdminRole(userId: string): Promise<boolean> {
  try {
    console.log("Checking if user already has admin role:", userId);
    
    // Use direct RPC call to the has_role function for more reliable check
    const { data: hasRoleResult, error: hasRoleError } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'admin'
    });
    
    if (hasRoleError) {
      console.error("Error checking role with RPC:", hasRoleError);
      
      // Fall back to direct table check if RPC fails
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (roleCheckError) {
        console.error("Error checking existing role:", roleCheckError);
        return false;
      }
      
      const hasRole = !!existingRole;
      console.log("User has admin role (via table check):", hasRole);
      return hasRole;
    }
    
    console.log("User has admin role (via RPC):", !!hasRoleResult);
    return !!hasRoleResult;
  } catch (error) {
    console.error("Role check error:", error);
    return false;
  }
}

/**
 * Find or create a user and add admin role
 */
export async function createUserWithAdminRole(values: CreateUserFormValues): Promise<boolean> {
  try {
    console.log("Creating new user with admin role:", values.email);
    
    let userId = null;
    
    // First check if user already exists
    userId = await findUserByEmail(values.email);
    
    if (!userId) {
      console.log("User doesn't exist, creating new user:", values.email);
      
      // Try using signUp API first which can be called with anon key
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
        return false;
      }
      
      if (!signUpData?.user) {
        console.error("Failed to create user: No user returned");
        return false;
      }
      
      userId = signUpData.user.id;
      console.log("User created via admin API:", userId);
    } else {
      console.log("User already exists, will check if they're already an admin:", userId);
      
      // Check if user is already an admin before adding the role
      const isAlreadyAdmin = await checkExistingAdminRole(userId);
      if (isAlreadyAdmin) {
        console.log("User is already an admin, no need to add the role again");
        return true;
      }
    }
    
    // Add admin role to the user
    const roleAdded = await addAdminRole(userId, values.firstName, values.lastName, values.email);
    console.log("Admin role added:", roleAdded);
    return roleAdded;
  } catch (error) {
    console.error("Error in createUserAccount:", error);
    return false;
  }
}

/**
 * Hook for managing admin user creation and role assignment
 */
export function useAdminDialogActions() {
  const { toast } = useToast();
  
  const handleCreateUserWithAdminRole = async (values: CreateUserFormValues) => {
    const success = await createUserWithAdminRole(values);
    
    if (success) {
      toast({
        title: "Admin user created",
        description: `${values.email} has been created and granted admin access.`,
      });
      return true;
    } else {
      toast({
        title: "Failed to create admin user",
        description: "The user account may have been created but we couldn't assign admin privileges.",
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
      
      console.log("User found, checking if already admin");
      // Check if user is already an admin by checking admin_users table
      const { data: existingAdminUser, error: checkError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking if user is already an admin:", checkError);
        throw new Error("Failed to check admin status");
      }
      
      if (existingAdminUser) {
        console.log("User is already an admin, attempting to update information");
        
        // User is already an admin, update their information
        const success = await addAdminRole(
          userId, 
          values.firstName || "Admin", 
          values.lastName || "User",
          values.email
        );
        
        if (success) {
          toast({
            title: "Admin updated",
            description: `${values.email} was already an admin. We've updated their information.`,
          });
          return { success: true, needsUserCreation: false };
        } else {
          toast({
            title: "Already an admin",
            description: "This user already has admin privileges, but we couldn't update their information.",
            variant: "destructive",
          });
          return { success: false, needsUserCreation: false };
        }
      }
      
      console.log("Adding admin role to user");
      // Add admin role to user with name metadata and email
      const success = await addAdminRole(
        userId, 
        values.firstName || "Admin", 
        values.lastName || "User",
        values.email
      );
      
      if (success) {
        toast({
          title: "Admin added",
          description: `${values.email} has been granted admin access.`,
        });
        return { success: true, needsUserCreation: false };
      } else {
        toast({
          title: "Failed to add admin",
          description: "An error occurred while trying to grant admin privileges.",
          variant: "destructive",
        });
        return { success: false, needsUserCreation: false };
      }
    } catch (error: any) {
      console.error("Error in handleAddAdmin:", error);
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
