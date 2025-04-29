
import { supabase } from "@/integrations/supabase/client";
import { SupabaseAuthUser, SupabaseAuthResponse } from "@/types/supabaseTypes";

/**
 * Checks if a user has admin role
 * @param userId The user ID to check
 * @returns Promise resolving to boolean indicating if user has admin role
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    console.log("Checking admin role for user:", userId);
    const { data: isAdmin, error } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'admin'
    });
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    console.log("Admin role check result:", isAdmin);
    return !!isAdmin;
  } catch (error) {
    console.error("Unexpected error checking admin role:", error);
    return false;
  }
}

/**
 * Adds admin role to a user
 * @param userId The user ID to add admin role to
 * @param firstName First name to set in metadata (required)
 * @param lastName Last name to set in metadata (required)
 * @returns Promise resolving to success status
 */
export async function addAdminRole(
  userId: string, 
  firstName: string, 
  lastName: string
): Promise<boolean> {
  try {
    console.log("Adding admin role with name data:", { userId, firstName, lastName });
    
    // Check if role already exists
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('id, metadata')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing role:", checkError);
      return false;
    }
    
    if (existingRole) {
      console.log("Admin role already exists:", existingRole);
      
      // If the role exists but we want to update the name, do it here
      // Get current metadata to preserve any other fields
      const currentMetadata = typeof existingRole.metadata === 'object' && existingRole.metadata !== null 
        ? existingRole.metadata 
        : {};
      
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ 
          metadata: { 
            ...currentMetadata,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          } 
        })
        .eq('id', existingRole.id);
        
      if (updateError) {
        console.error("Error updating admin name:", updateError);
        return false;
      }
      
      // Also ensure the user exists in the users table
      await ensureUserInUsersTable(userId, firstName, lastName);
      
      return true;
    }
    
    // Prepare metadata object - always include first and last name
    const metadata = {
      created_at: new Date().toISOString(),
      first_name: firstName,
      last_name: lastName
    };
    
    console.log("Creating new admin role with metadata:", metadata);
    
    // Add admin role for user
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId, 
        role: 'admin',
        metadata
      });
    
    if (insertError) {
      console.error("Error adding admin role:", insertError);
      return false;
    }
    
    // Ensure user exists in users table
    await ensureUserInUsersTable(userId, firstName, lastName);
    
    return true;
  } catch (error) {
    console.error("Error adding admin role:", error);
    return false;
  }
}

/**
 * Helper function to ensure user exists in users table
 */
async function ensureUserInUsersTable(userId: string, firstName: string, lastName: string): Promise<boolean> {
  try {
    // First check if user already exists in users table
    const { data: existingUser, error: checkUserError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkUserError) {
      console.error("Error checking if user exists:", checkUserError);
    }
    
    const email = await getUserEmail(userId);
    console.log("Got email for user:", email);
    
    if (!existingUser) {
      // Only insert if user doesn't exist
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email || 'unknown@email.com',
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          user_type: 'admin'
        });
      
      if (userInsertError) {
        console.error("Error adding user record:", userInsertError);
        // Continue anyway, this is just a helper record
        return false;
      }
    } else {
      // User exists, update their info to ensure it's current
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          email: email || existingUser.email || 'unknown@email.com',
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          user_type: 'admin'
        })
        .eq('id', userId);
      
      if (userUpdateError) {
        console.error("Error updating user record:", userUpdateError);
        return false;
      }
    }
    
    return true;
  } catch (userInsertErr) {
    console.error("Failed to add/update user record:", userInsertErr);
    return false;
  }
}

/**
 * Helper function to get user email from user ID
 */
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    // First try the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')  // Explicitly select email field
      .eq('id', userId)
      .maybeSingle();
    
    if (!userError && userData?.email) {
      return userData.email;
    }
    
    // Try to get from auth
    try {
      // Use proper typing for auth response
      const { data, error } = await supabase.auth.admin.getUserById(userId) as unknown as SupabaseAuthResponse;
      
      if (!error && data && data.user) {
        // Now properly typed, so TypeScript knows email exists
        const userEmail = data.user.email;
        
        // Add defensive check for email
        if (!userEmail) {
          console.warn("User found but email is missing:", userId);
          return null;
        }
        
        return userEmail;
      }
    } catch (authError) {
      console.error("Error getting user email from auth:", authError);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

/**
 * Removes admin role from a user
 * @param adminId The user ID to remove admin role from
 * @returns Promise resolving to success status
 */
export async function removeAdminRole(adminId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', adminId)
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error removing admin role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error removing admin role:", error);
    return false;
  }
}

/**
 * Updates admin user name metadata
 * @param userId User ID to update
 * @param firstName First name to set
 * @param lastName Last name to set
 * @returns Promise resolving to success status
 */
export async function updateAdminName(
  userId: string, 
  firstName: string, 
  lastName: string
): Promise<boolean> {
  try {
    // Find the specific user role entry
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('id, metadata')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking if admin role exists:", checkError);
      return false;
    }
    
    if (!existingRole) {
      console.error("Admin role not found for user:", userId);
      return false;
    }
    
    // Ensure metadata is an object before updating
    const currentMetadata = typeof existingRole.metadata === 'object' && existingRole.metadata !== null 
      ? existingRole.metadata 
      : {};
    
    console.log("Updating admin name with data:", { userId, firstName, lastName });
    console.log("Current metadata:", currentMetadata);
    
    // Update metadata on the user_roles entry with name information
    const { error: updateError } = await supabase
      .from('user_roles')
      .update({
        metadata: {
          ...currentMetadata,
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString()
        }
      })
      .eq('id', existingRole.id);
    
    if (updateError) {
      console.error("Error updating admin user name:", updateError);
      return false;
    }
    
    // Also update users table if the record exists
    try {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', userId);
      
      if (userUpdateError) {
        console.error("Error updating user record:", userUpdateError);
        // Continue anyway, the main user_roles record was updated
      }
    } catch (userUpdateErr) {
      console.error("Failed to update user record:", userUpdateErr);
      // Continue anyway
    }
    
    return true;
  } catch (error) {
    console.error("Error updating name:", error);
    return false;
  }
}
