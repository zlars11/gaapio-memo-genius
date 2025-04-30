
import { supabase } from "@/integrations/supabase/client";
import { AdminUser, AdminFormValues } from "@/types/adminTypes";
import { ensureUserInUsersTable, getUserEmail } from "@/utils/adminUtils";

/**
 * Adds admin role to a user
 * @param userId The user ID to add admin role to
 * @param firstName First name to set (required)
 * @param lastName Last name to set (required)
 * @param email Email to set (required)
 * @returns Promise resolving to success status and error message if any
 */
export async function addAdminRole(
  userId: string, 
  firstName: string, 
  lastName: string,
  email: string
): Promise<{success: boolean, error?: string}> {
  try {
    console.log("Adding admin role:", { userId, firstName, lastName, email });
    
    // Check if role already exists
    const { data: existingRole, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing role:", checkError);
      return { success: false, error: checkError.message };
    }
    
    if (existingRole) {
      console.log("Admin role already exists:", existingRole);
      
      // Update the existing admin user with new name information
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          first_name: firstName,
          last_name: lastName,
          email: email
        })
        .eq('id', existingRole.id);
        
      if (updateError) {
        console.error("Error updating admin name:", updateError);
        return { success: false, error: updateError.message };
      }
      
      // Ensure user exists in users table
      await ensureUserInUsersTable(userId, firstName, lastName, email);
      
      return { success: true };
    }
    
    // Add admin role for user
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({ 
        user_id: userId, 
        role: 'admin',
        first_name: firstName,
        last_name: lastName,
        email: email
      });
    
    if (insertError) {
      console.error("Error adding admin role:", insertError);
      return { success: false, error: insertError.message };
    }
    
    // Ensure user exists in users table
    await ensureUserInUsersTable(userId, firstName, lastName, email);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error adding admin role:", error);
    return { success: false, error: error.message || "Unknown error" };
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
      .from('admin_users')
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
 * Updates admin user name and email
 * @param userId User ID to update
 * @param firstName First name to set
 * @param lastName Last name to set
 * @param email Email to update (optional)
 * @returns Promise resolving to success status
 */
export async function updateAdminName(
  userId: string, 
  firstName: string, 
  lastName: string,
  email?: string
): Promise<boolean> {
  try {
    // Find the specific user role entry
    const { data: existingRole, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
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
    
    // Update name on the admin_users entry
    const updateData: { first_name: string; last_name: string; email?: string } = {
      first_name: firstName,
      last_name: lastName
    };
    
    // Add email to update if provided
    if (email) {
      updateData.email = email;
    }
    
    const { error: updateError } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', existingRole.id);
    
    if (updateError) {
      console.error("Error updating admin user name:", updateError);
      return false;
    }
    
    // Also update users table if the record exists
    try {
      const updateUserData: { first_name: string; last_name: string; email?: string } = {
        first_name: firstName,
        last_name: lastName
      };
      
      if (email) {
        updateUserData.email = email;
      }
      
      const { error: userUpdateError } = await supabase
        .from("users")
        .update(updateUserData)
        .eq('id', userId);
      
      if (userUpdateError) {
        console.error("Error updating user record:", userUpdateError);
      }
    } catch (userUpdateErr) {
      console.error("Failed to update user record:", userUpdateErr);
    }
    
    return true;
  } catch (error) {
    console.error("Error updating name:", error);
    return false;
  }
}
