
import { supabase } from "@/integrations/supabase/client";
import { addAdminRole } from "@/utils/adminRoleUtils";
import { useToast } from "@/components/ui/use-toast";
import { AddAdminFormValues } from "../forms/AddAdminForm";
import { CreateUserFormValues } from "../dialogs/CreateUserDialog";

// Define an interface for the user structure we get from Supabase auth
export interface SupabaseAuthUser {
  id: string;
  email?: string | null;
}

/**
 * Finds a user by email address using various methods
 * @param email Email address to search for
 * @returns User ID if found, null otherwise
 */
export async function findUserByEmail(email: string): Promise<string | null> {
  try {
    // Check in users table first (easier for most implementations)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle();
    
    if (!userError && userData) {
      console.log("Found user in users table:", userData.id);
      return userData.id;
    }
    
    // If not found in users table, try auth.admin API
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && authUsers && authUsers.users) {
        const matchingUser = authUsers.users.find(
          (user: SupabaseAuthUser) => user.email && user.email.toLowerCase() === email.toLowerCase()
        );
        
        if (matchingUser) {
          console.log("Found user in auth:", matchingUser.id);
          return matchingUser.id;
        }
      }
      
      // Try alternative method - using signUp with existing email should fail with user exists error
      const { error } = await supabase.auth.signUp({
        email: email,
        password: 'temporaryPassword123', // This won't be used if user exists
      });
      
      if (error && error.message.includes('already registered')) {
        // User exists, let's try to get their ID a different way
        console.log("User exists based on signup attempt");
        
        // One final attempt - fetch all users and filter manually
        const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
        
        if (!fetchError && users) {
          const matchingUser = users.find(
            (user: SupabaseAuthUser) => user.email && user.email.toLowerCase() === email.toLowerCase()
          );
          
          if (matchingUser) {
            console.log("Found user ID through direct fetch:", matchingUser.id);
            return matchingUser.id;
          }
        }
      }
    } catch (authListError) {
      console.error("Auth admin API error:", authListError);
    }
    
    // User not found
    return null;
  } catch (error) {
    console.error("Error during user existence check:", error);
    return null;
  }
}

/**
 * Checks if a user already has the admin role
 * @param userId User ID to check
 * @returns True if user already has admin role, false otherwise
 */
export async function checkExistingAdminRole(userId: string): Promise<boolean> {
  try {
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (roleCheckError) {
      console.error("Error checking existing role:", roleCheckError);
      return false;
    }
    
    return !!existingRole;
  } catch (error) {
    console.error("Role check error:", error);
    return false;
  }
}

/**
 * Creates a new user with admin role
 * @param values Form values with user details
 * @returns Success status
 */
export async function createUserWithAdminRole(values: CreateUserFormValues): Promise<boolean> {
  try {
    console.log("Creating new user with admin role:", values.email);
    
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
      return await addAdminRole(data.user.id, values.firstName, values.lastName);
    } 
    
    if (signUpData && signUpData.user) {
      console.log("User created via signUp:", signUpData.user.id);
      
      // Add admin role to the newly created user
      return await addAdminRole(signUpData.user.id, values.firstName, values.lastName);
    }
    
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
    console.log("handleCreateUserWithAdminRole called with:", values);
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
        description: "The user account was created but we couldn't assign admin privileges.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleAddAdminRole = async (values: AddAdminFormValues) => {
    try {
      // First check if user exists
      const userId = await findUserByEmail(values.email);
      
      if (!userId) {
        return { success: false, needsUserCreation: true };
      }
      
      // Check if user is already an admin
      const isAlreadyAdmin = await checkExistingAdminRole(userId);
      
      if (isAlreadyAdmin) {
        toast({
          title: "Already an admin",
          description: "This user already has admin privileges.",
          variant: "destructive",
        });
        return { success: false, needsUserCreation: false };
      }
      
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
