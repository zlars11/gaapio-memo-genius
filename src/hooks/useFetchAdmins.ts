
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/adminTypes";
import { CurrentAdminUser } from "@/hooks/useCurrentAdmin";

interface FetchAdminsResult {
  success: boolean;
  isCurrentUserDisplayed: boolean;
}

export function useFetchAdmins(currentUser: CurrentAdminUser) {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async (): Promise<FetchAdminsResult> => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching admin users - started");
      
      // Query user_roles table directly
      console.log("Fetching admin users from user_roles");
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, created_at, metadata')
        .eq('role', 'admin');
      
      if (roleError) {
        console.error("Error fetching admin roles:", roleError);
        setError("Failed to fetch admin roles");
        setAdmins([]);
        return { success: false, isCurrentUserDisplayed: false };
      }
      
      console.log(`Found ${roleData?.length || 0} admin role records:`, roleData);
      
      if (!roleData || roleData.length === 0) {
        console.log("No admin users found");
        setAdmins([]);
        return { success: true, isCurrentUserDisplayed: false };
      }
      
      // Extract user IDs from the role data
      const adminUserIds = roleData.map(role => role.user_id);
      console.log("Admin user IDs:", adminUserIds);
      
      // Check if current user is in admin list
      let isCurrentUserInList = false;
      if (currentUser.id) {
        isCurrentUserInList = adminUserIds.includes(currentUser.id);
        console.log("Is current user in admin list:", isCurrentUserInList);
      }
      
      // Get user details from auth.users table
      console.log("Fetching user details from auth");
      const adminUsers: AdminUser[] = [];
      
      for (const roleEntry of roleData) {
        try {
          const userId = roleEntry.user_id;
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
          
          if (authError) {
            console.error(`Error fetching auth user ${userId}:`, authError);
            continue;
          }
          
          if (authUser?.user) {
            console.log(`Found auth user ${userId}:`, authUser.user.email);
            
            // Check if metadata is an object and has the required properties
            const metadata = typeof roleEntry.metadata === 'object' && roleEntry.metadata !== null 
              ? roleEntry.metadata 
              : {};
            
            adminUsers.push({
              id: userId,
              email: authUser.user.email || 'No email',
              first_name: metadata && 'first_name' in metadata ? metadata.first_name as string || null : null,
              last_name: metadata && 'last_name' in metadata ? metadata.last_name as string || null : null,
              created_at: roleEntry.created_at || authUser.user.created_at
            });
          }
        } catch (error) {
          console.error(`Error processing auth user ${roleEntry.user_id}:`, error);
        }
      }
      
      console.log(`Processed ${adminUsers.length} admin users:`, adminUsers);
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
  };

  return {
    loading,
    admins,
    error,
    fetchAdmins,
    setAdmins
  };
}
