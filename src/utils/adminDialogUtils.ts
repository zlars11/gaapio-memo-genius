
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
 * Find a user by email in Supabase Auth
 */
export async function findUserByAuthEmail(email: string): Promise<{id: string | null, exists: boolean}> {
  try {
    console.log("Looking for auth user with email:", email);
    
    // Try using the admin API to find the user
    try {
      const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100
      });
      
      if (error) {
        console.error("Error searching for user in auth:", error);
        throw error;
      }
      
      if (data && data.users) {
        // Type the users array explicitly to fix the 'never' type issue
        const users = data.users;
        // Use a type predicate to ensure TypeScript knows what's returned
        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        
        if (user) {
          console.log("Found user in auth system:", user.id);
          return { id: user.id, exists: true };
        }
      }
    } catch (authApiError) {
      console.error("Unable to use admin list API:", authApiError);
    }
    
    // Fall back to findUserByEmail (which also checks the users table)
    const userId = await findUserByEmail(email);
    return { id: userId, exists: !!userId };
  } catch (error) {
    console.error("Error in findUserByAuthEmail:", error);
    return { id: null, exists: false };
  }
}

/**
 * Check if a user is already in the admin_users table
 */
export async function checkUserInAdminTable(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking admin table:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking admin table:", error);
    return false;
  }
}

/**
 * Add a user directly to the admin_users table
 */
export async function addUserToAdminTable(
  userId: string, 
  email: string, 
  firstName: string, 
  lastName: string
): Promise<{success: boolean, error: string | null}> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .insert({
        user_id: userId,
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        role: 'admin'
      });
    
    if (error) {
      console.error("Error adding to admin table:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Exception adding to admin table:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Find or create a user and add admin role
 */
export async function createUserWithAdminRole(values: CreateUserFormValues): Promise<boolean> {
  try {
    console.log("Creating new user with admin role:", values.email);
    
    let userId = null;
    
    // First check if user already exists using our new function
    const { id: existingUserId, exists: userExists } = await findUserByAuthEmail(values.email);
    
    if (userExists && existingUserId) {
      console.log("User already exists, checking if already an admin:", existingUserId);
      
      // Check if user is already in admin_users table
      const isAlreadyAdmin = await checkUserInAdminTable(existingUserId);
      
      if (isAlreadyAdmin) {
        console.log("User is already an admin, no need to add again");
        return true;
      }
      
      // User exists but is not an admin, add them to admin_users
      console.log("User exists but is not an admin, adding to admin_users");
      const { success } = await addUserToAdminTable(
        existingUserId, 
        values.email, 
        values.firstName, 
        values.lastName
      );
      
      return success;
    }
    
    // User doesn't exist, create them
    console.log("User doesn't exist, creating new user:", values.email);
    
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
      return false;
    }
    
    if (!signUpData?.user) {
      console.error("Failed to create user: No user returned");
      return false;
    }
    
    userId = signUpData.user.id;
    console.log("User created via admin API:", userId);
    
    // Add user to admin_users table
    const { success } = await addUserToAdminTable(
      userId, 
      values.email, 
      values.firstName, 
      values.lastName
    );
    
    return success;
  } catch (error) {
    console.error("Error in createUserWithAdminRole:", error);
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
      
      // First check if user exists in Auth system using our improved function
      const { id: userId, exists: userExists } = await findUserByAuthEmail(values.email);
      
      if (!userExists || !userId) {
        console.log("User not found, needs to be created");
        return { success: false, needsUserCreation: true };
      }
      
      console.log("User found in auth system, checking if already in admin_users table");
      // Check if user is already in admin_users table
      const isAlreadyInAdminTable = await checkUserInAdminTable(userId);
      
      if (isAlreadyInAdminTable) {
        console.log("User is already in admin_users table");
        toast({
          title: "Already an admin",
          description: "This user already has admin privileges.",
        });
        return { success: true, needsUserCreation: false };
      }
      
      console.log("User exists but is not in admin_users table, adding now");
      // Add user to admin_users table
      const { success, error } = await addUserToAdminTable(
        userId,
        values.email,
        values.firstName || "",
        values.lastName || ""
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
          description: error || "An error occurred while trying to grant admin privileges.",
          variant: "destructive",
        });
        return { success: false, needsUserCreation: false };
      }
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
