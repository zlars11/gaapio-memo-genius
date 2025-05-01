
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addAdminRole } from "@/utils/adminRoleUtils";
import { checkAdminRole } from "@/utils/adminUtils";
import { CurrentAdminUser } from "@/types/adminTypes";

export function useCurrentAdmin() {
  const [currentUser, setCurrentUser] = useState<CurrentAdminUser>({
    id: null,
    email: null,
    isAdmin: false,
    displayedInList: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user's info and admin status
  const fetchCurrentUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching current user info");

      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setError("Failed to get user session: " + sessionError.message);
        return;
      }

      const session = sessionData?.session;
      
      if (!session?.user) {
        console.log("No active user session");
        setCurrentUser({
          id: null,
          email: null,
          isAdmin: false,
          displayedInList: false
        });
        return;
      }
      
      const userId = session.user.id;
      const email = session.user.email;
      console.log("Current user from session:", { userId, email });
      
      // Check if user is an admin
      const isAdmin = await checkAdminRole(userId);
      console.log("User is admin:", isAdmin);

      // Check if user is in the admin_users table directly
      if (isAdmin && userId) {
        const { data: adminUserRecord, error: adminUserError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (adminUserError) {
          console.error("Error checking admin_users table:", adminUserError);
        }
        
        const displayedInList = !!adminUserRecord;
        console.log("User is displayed in admin list:", displayedInList);
        
        setCurrentUser({
          id: userId,
          email,
          isAdmin,
          displayedInList
        });
      } else {
        setCurrentUser({
          id: userId,
          email,
          isAdmin,
          displayedInList: false
        });
      }
    } catch (err: any) {
      console.error("Error in fetchCurrentUserInfo:", err);
      setError("Failed to get user information: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fix admin status for current user
  const fixAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      if (!currentUser.id || !currentUser.email) {
        console.error("Cannot fix admin status: User ID or email is missing");
        return false;
      }

      console.log("Fixing admin status for current user:", currentUser);
      
      // First check if user already exists in admin_users table
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('id, user_id')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking for existing admin record:", checkError);
        throw new Error(`Failed to check admin status: ${checkError.message}`);
      }
      
      if (existingAdmin) {
        console.log("User already exists in admin_users table:", existingAdmin);
        
        // Update currentUser state to show as displayed
        setCurrentUser(prev => ({
          ...prev,
          displayedInList: true
        }));
        
        return true;
      }
      
      // User doesn't exist in admin_users, add them
      const { success, error } = await addAdminRole(
        currentUser.id, 
        "Admin", // Default name
        "User",  // Default name
        currentUser.email
      );
      
      if (!success) {
        console.error("Failed to add admin role:", error);
        throw new Error(`Failed to add admin role: ${error}`);
      }
      
      console.log("Admin role added successfully");
      
      // Update currentUser state
      setCurrentUser(prev => ({
        ...prev,
        displayedInList: true
      }));
      
      return true;
    } catch (err: any) {
      console.error("Error in fixAdminStatus:", err);
      throw err; // Re-throw to allow caller to handle error properly
    }
  }, [currentUser]);

  // Get current user on mount
  useEffect(() => {
    fetchCurrentUserInfo();
  }, [fetchCurrentUserInfo]);

  return {
    currentUser,
    setCurrentUser,
    loading,
    error,
    fixAdminStatus,
  };
}
