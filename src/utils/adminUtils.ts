
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a user has admin role
 * @param userId User ID to check
 * @returns Promise resolving to boolean indicating if user is admin
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    // First check for admin_users table entry - direct query
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (adminError) {
      console.error("Error checking admin role:", adminError);
    }
    
    return !!adminRecord; // If record exists, user is admin
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Find a user by email in auth system
 * @param email Email to find
 * @returns Promise resolving to user ID if found, null otherwise
 */
export async function findUserByEmail(email: string): Promise<string | null> {
  try {
    // First try public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (!userError && userData?.id) {
      return userData.id;
    }
    
    // If above fails, try via auth admin API
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error("Error listing users:", error);
      return null;
    }
    
    const user = data?.users?.find(user => user.email === email);
    return user?.id || null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}

/**
 * Get user email from auth
 * @param userId User ID to lookup
 * @returns Promise resolving to email or null
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    // First check if we can get it from the session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user?.id === userId && sessionData?.session?.user?.email) {
      return sessionData.session.user.email;
    }
    
    // Otherwise try to get from users table (public schema)
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error getting user email from users table:", error);
      return null;
    }
    
    return data?.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

/**
 * Ensure user exists in users table
 * @param userId User ID to ensure
 * @param firstName User's first name
 * @param lastName User's last name
 * @param email User's email
 */
export async function ensureUserInUsersTable(
  userId: string,
  firstName: string,
  lastName: string,
  email: string
): Promise<void> {
  try {
    // Check if user already exists in users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking if user exists:", checkError);
      return;
    }
    
    if (existingUser) {
      // User exists, update their info
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: email,
          user_type: 'admin',
          status: 'active'
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error("Error updating user in users table:", updateError);
      }
    } else {
      // User doesn't exist, insert them
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          user_type: 'admin',
          status: 'active'
        });
      
      if (insertError) {
        console.error("Error inserting user to users table:", insertError);
      }
    }
  } catch (error) {
    console.error("Error ensuring user in users table:", error);
  }
}
