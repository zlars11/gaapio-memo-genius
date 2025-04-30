
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser, CurrentAdminUser } from "@/types/adminTypes";

interface FetchAdminsResult {
  success: boolean;
  isCurrentUserDisplayed: boolean;
}

export function useFetchAdmins(currentUser: CurrentAdminUser) {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch all admin users
  const fetchAdmins = useCallback(async (): Promise<FetchAdminsResult> => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching admin users");
      
      // Query admin_users table
      const { data: adminRoles, error: roleError } = await supabase
        .from('admin_users')
        .select('id, user_id, role, created_at, first_name, last_name, email')
        .eq('role', 'admin');
      
      if (roleError) {
        console.error("Error fetching admin roles:", roleError);
        setError("Failed to fetch admin roles");
        setAdmins([]);
        return { success: false, isCurrentUserDisplayed: false };
      }
      
      console.log(`Found ${adminRoles?.length || 0} admin records:`, adminRoles);
      
      if (!adminRoles || adminRoles.length === 0) {
        console.log("No admin users found");
        setAdmins([]);
        return { success: true, isCurrentUserDisplayed: false };
      }
      
      // Check if current user is in admin list
      let isCurrentUserInList = false;
      if (currentUser.id) {
        isCurrentUserInList = adminRoles.some(role => role.user_id === currentUser.id);
        console.log("Is current user in admin list:", isCurrentUserInList);
      }
      
      // Convert to admin users array
      const adminUsers: AdminUser[] = [];
      
      for (const role of adminRoles) {
        try {
          // Use email from admin_users table if available
          let userEmail = role.email;
          
          // If email is missing, try to get from auth or current user
          if (!userEmail) {
            if (currentUser.id === role.user_id && currentUser.email) {
              userEmail = currentUser.email;
              console.log(`Using current user email for ${role.user_id}:`, currentUser.email);
              
              // Update the missing email in the admin_users table
              const { error: updateError } = await supabase
                .from('admin_users')
                .update({ email: userEmail })
                .eq('id', role.id);
                
              if (updateError) {
                console.error(`Failed to update email for admin ${role.id}:`, updateError);
              }
            }
          }
          
          adminUsers.push({
            id: role.id,
            user_id: role.user_id,
            email: userEmail,
            first_name: role.first_name,
            last_name: role.last_name,
            role: role.role,
            created_at: role.created_at
          });
        } catch (error) {
          console.error(`Error processing admin user ${role.user_id}:`, error);
        }
      }
      
      console.log(`Processed ${adminUsers.length} admin users:`, adminUsers);
      
      // Sort admins by created_at date (newest first)
      adminUsers.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      setAdmins(adminUsers);
      
      return {
        success: true,
        isCurrentUserDisplayed: isCurrentUserInList
      };
    } catch (error) {
      console.error("Unexpected error in fetchAdmins:", error);
      setError("An unexpected error occurred while fetching admin users");
      setAdmins([]);
      return { success: false, isCurrentUserDisplayed: false };
    } finally {
      setLoading(false);
    }
  }, [currentUser.id, currentUser.email]); 

  return {
    loading,
    admins,
    error,
    fetchAdmins,
    setAdmins
  };
}
