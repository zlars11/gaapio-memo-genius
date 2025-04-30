
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
 * Creates a new user with admin role
 */
export async function createUserWithAdminRole(values: CreateUserFormValues): Promise<boolean> {
  try {
    console.log("Creating new user with admin role:", values.email);
    
    // Before attempting to create the user, check if they already exist
    const existingUserId = await findUserByEmail(values.email);
    
    if (existingUserId) {
      console.log("User already exists, adding admin role:", existingUserId);
      // User exists, just add admin role
      return await addAdminRole(existingUserId, values.firstName, values.lastName);
    }
    
    // Try using signUp API first which can be called with anon key
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName
        }
      }
    });
    
    if (signUpError) {
      console.error("Error creating user with signUp:", signUpError);
      
      // Fall back to admin.createUser if available
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: values.email,
          password: values.password,
          email_confirm: true,
          user_metadata: {
            first_name: values.firstName,
            last_name: values.lastName
          }
        });
        
        if (error || !data.user) {
          console.error("Error creating user with admin API:", error);
          return false;
        }
        
        console.log("User created via admin API:", data.user.id);
        
        // Add admin role to the newly created user
        const roleAdded = await addAdminRole(data.user.id, values.firstName, values.lastName);
        console.log("Admin role added:", roleAdded);
        return roleAdded;
      } catch (adminApiError) {
        console.error("Admin API error:", adminApiError);
        return false;
      }
    } 
    
    if (signUpData && signUpData.user) {
      console.log("User created via signUp:", signUpData.user.id);
      
      // Add admin role to the newly created user
      const roleAdded = await addAdminRole(signUpData.user.id, values.firstName, values.lastName);
      console.log("Admin role added:", roleAdded);
      return roleAdded;
    }
    
    console.error("Failed to create user, no error but no user returned");
    return false;
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
      // First check if user exists
      const userId = await findUserByEmail(values.email);
      
      if (!userId) {
        console.log("User not found, needs to be created");
        return { success: false, needsUserCreation: true };
      }
      
      console.log("User found, checking if already admin");
      // Check if user is already an admin
      const isAlreadyAdmin = await checkExistingAdminRole(userId);
      
      if (isAlreadyAdmin) {
        console.log("User is already an admin, attempting to update metadata and ensure visibility");
        
        // User is already an admin, but might not be showing in the list
        // Let's update or add their metadata to make sure they appear in the list
        const success = await addAdminRole(
          userId, 
          values.firstName || "Admin", 
          values.lastName || "User"
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
      // Add admin role to user with name metadata
      const success = await addAdminRole(
        userId, 
        values.firstName || "Admin", // Provide default if missing
        values.lastName || "User"    // Provide default if missing
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
