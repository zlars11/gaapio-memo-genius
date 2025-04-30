
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SupabaseAuthUser } from "@/types/supabaseTypes";
import { AdminUser } from "@/types/adminTypes";

/**
 * Checks if a user has admin role
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
 * Get Supabase Auth user by ID
 */
export async function getAuthUser(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error || !data?.user) {
      console.error("Error fetching auth user:", error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error("Error fetching auth user:", error);
    return null;
  }
}

/**
 * Get user email from auth user
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const authUser = await getAuthUser(userId);
    return authUser?.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

/**
 * Ensure user exists in users table
 */
export async function ensureUserInUsersTable(
  userId: string, 
  firstName: string, 
  lastName: string,
  email?: string | null
): Promise<boolean> {
  try {
    // Get email if not provided
    const userEmail = email || await getUserEmail(userId);
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking if user exists:", checkError);
      return false;
    }
    
    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase
        .from("users")
        .update({
          email: userEmail || 'unknown@email.com',
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          user_type: 'admin'
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error("Error updating user record:", updateError);
        return false;
      }
    } else {
      // Create new user
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          id: userId,
          email: userEmail || 'unknown@email.com',
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          user_type: 'admin'
        });
      
      if (insertError) {
        console.error("Error creating user record:", insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in ensureUserInUsersTable:", error);
    return false;
  }
}

/**
 * Find a Supabase Auth user by email
 */
export async function findUserByEmail(email: string): Promise<string | null> {
  try {
    console.log("Searching for user with email:", email);
    
    // Check in users table first
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle();
    
    if (!userError && userData) {
      console.log("Found user in users table:", userData.id);
      return userData.id;
    }
    
    // Try auth admin API
    try {
      const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100
      });
      
      if (!error && data?.users) {
        const user = data.users.find((u: SupabaseAuthUser) => 
          u.email?.toLowerCase() === email.toLowerCase()
        );
        
        if (user) {
          console.log("Found user via auth list:", user.id);
          return user.id;
        }
      }
    } catch (authApiError) {
      console.log("Unable to use admin list API:", authApiError);
    }
    
    console.log("User not found with email:", email);
    return null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}
