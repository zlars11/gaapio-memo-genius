
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/adminTypes";
import { CurrentAdminUser } from "@/hooks/useCurrentAdmin";
import { SupabaseAuthUser } from "@/types/supabaseTypes";

interface FetchAdminsResult {
  success: boolean;
  isCurrentUserDisplayed: boolean;
}

export function useFetchAdmins(currentUser: CurrentAdminUser) {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use a stable reference for the fetchAdmins function
  const fetchAdmins = useCallback(async (): Promise<FetchAdminsResult> => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching admin users - started");
      
      // Query user_roles table directly with metadata for names
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, created_at, metadata, id')
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
      
      // Get user details from users table and auth.users
      const adminUsers: AdminUser[] = [];
      
      for (const roleEntry of roleData) {
        try {
          const userId = roleEntry.user_id;
          
          // Use users table to get user email
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email')
            .eq('id', userId)
            .maybeSingle();
          
          let userEmail = null;
          
          if (userError) {
            console.error(`Error fetching user ${userId} from users table:`, userError);
          } else if (userData) {
            userEmail = userData.email;
            console.log(`Found user ${userId} in users table:`, userEmail);
          }
          
          // If email not found in users table, try to get from auth directly
          if (!userEmail) {
            try {
              const { data: authUserData, error: authUserError } = await supabase.auth.admin.getUserById(userId);
              
              if (authUserError) {
                console.error(`Error fetching auth user ${userId}:`, authUserError);
              } else if (authUserData?.user) {
                // Properly typed access to user email
                const authUser = authUserData.user as SupabaseAuthUser;
                userEmail = authUser.email || null;
                console.log(`Found auth user ${userId}:`, userEmail);
              }
            } catch (authErr) {
              console.error(`Error accessing auth admin API for ${userId}:`, authErr);
              
              // If this is the current user and we know their email, use it
              if (currentUser.id === userId && currentUser.email) {
                userEmail = currentUser.email;
                console.log(`Using current user email for ${userId}:`, userEmail);
              }
            }
          }
          
          if (!userEmail && currentUser.id === userId && currentUser.email) {
            userEmail = currentUser.email;
            console.log(`Using current user email for ${userId}:`, userEmail);
          }
          
          if (!userEmail) {
            console.error(`Could not find email for user ${userId}`);
            continue;
          }
          
          // Extract name from metadata
          const metadata = typeof roleEntry.metadata === 'object' && roleEntry.metadata !== null 
            ? roleEntry.metadata 
            : {};
          
          const firstName = metadata && 'first_name' in metadata ? metadata.first_name as string : null;
          const lastName = metadata && 'last_name' in metadata ? metadata.last_name as string : null;
          
          adminUsers.push({
            id: userId,
            email: userEmail,
            first_name: firstName,
            last_name: lastName,
            created_at: roleEntry.created_at
          });
        } catch (error) {
          console.error(`Error processing admin user ${roleEntry.user_id}:`, error);
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
