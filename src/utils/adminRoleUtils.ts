import { supabase } from "@/integrations/supabase/client";

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
    
    return true;
  } catch (error) {
    console.error("Error adding admin role:", error);
    return false;
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
    
    return true;
  } catch (error) {
    console.error("Error updating name:", error);
    return false;
  }
}
