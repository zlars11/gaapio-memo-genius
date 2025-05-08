
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
      
      // Query admin_users table with all necessary columns
      const { data: adminRoles, error: roleError } = await supabase
        .from('admin_users')
        .select('id, user_id, role, created_at, first_name, last_name, email');
      
      if (roleError) {
        console.error("Error fetching admin roles:", roleError);
        setError("Failed to fetch admin roles: " + roleError.message);
        setAdmins([]);
        setLoading(false);
        return { success: false, isCurrentUserDisplayed: false };
      }
      
      console.log(`Found ${adminRoles?.length || 0} admin records:`, adminRoles);
      
      if (!adminRoles || adminRoles.length === 0) {
        console.log("No admin users found");
        setAdmins([]);
        setLoading(false);
        return { success: true, isCurrentUserDisplayed: false };
      }
      
      // Check if current user is in admin list by user_id
      let isCurrentUserInList = false;
      if (currentUser.id) {
        console.log("Current user ID:", currentUser.id);
        console.log("Admin user IDs:", adminRoles.map(role => role.user_id));
        
        isCurrentUserInList = adminRoles.some(role => 
          role.user_id && String(role.user_id).toLowerCase() === String(currentUser.id).toLowerCase()
        );
        console.log("Is current user in admin list:", isCurrentUserInList);
      }
      
      // Convert to admin users array and handle missing names properly
      const adminUsers: AdminUser[] = adminRoles.map(role => ({
        id: role.id,
        user_id: role.user_id,
        email: role.email || 'Unknown Email',
        first_name: role.first_name || '',
        last_name: role.last_name || '',
        role: role.role,
        created_at: role.created_at
      }));
      
      console.log(`Processed ${adminUsers.length} admin users:`, adminUsers);
      
      // Sort admins by created_at date (newest first)
      adminUsers.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      setAdmins(adminUsers);
      setLoading(false);
      
      return {
        success: true,
        isCurrentUserDisplayed: isCurrentUserInList
      };
    } catch (error: any) {
      console.error("Unexpected error in fetchAdmins:", error);
      setError("An unexpected error occurred while fetching admin users: " + error.message);
      setAdmins([]);
      setLoading(false);
      return { success: false, isCurrentUserDisplayed: false };
    }
  }, [currentUser.id]); 

  return {
    loading,
    admins,
    error,
    fetchAdmins,
    setAdmins
  };
}
