
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addAdminRole } from "@/utils/adminRoleUtils";
import { checkAdminRole } from "@/utils/adminUtils";
import { CurrentAdminUser } from "@/types/adminTypes";
import { useToast } from "@/components/ui/use-toast";

export function useCurrentAdmin() {
  // Add first_name field to the CurrentAdminUser type to fix the error
  const [currentUser, setCurrentUser] = useState<CurrentAdminUser & { first_name?: string }>({
    id: null,
    email: null,
    isAdmin: false,
    displayedInList: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user's info and admin status
  const fetchCurrentUserInfo = useCallback(async () => {
    try {
      // Only set loading to true if we're not already loading
      // This helps prevent excessive re-renders
      setLoading(prevLoading => {
        if (!prevLoading) return true;
        return prevLoading;
      });
      
      setError(null);
      console.log("Fetching current user info");

      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setError("Failed to get user session: " + sessionError.message);
        toast({
          title: "Session Error",
          description: "Failed to get your session: " + sessionError.message,
          variant: "destructive"
        });
        setLoading(false); // Always set loading to false on error
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
        setLoading(false); // Always set loading to false when done
        return;
      }
      
      const userId = session.user.id;
      const email = session.user.email;
      console.log("Current user from session:", { userId, email });
      
      // Check if user is an admin
      let isAdmin = false;
      try {
        isAdmin = await checkAdminRole(userId);
        console.log("User is admin:", isAdmin);
      } catch (adminCheckError) {
        console.error("Error checking admin role:", adminCheckError);
        toast({
          title: "Admin Check Failed",
          description: "Could not verify your admin status. Please try again.",
          variant: "destructive"
        });
      }

      // Check if user is in the admin_users table directly
      if (isAdmin && userId) {
        try {
          const { data: adminUserRecord, error: adminUserError } = await supabase
            .from('admin_users')
            .select('id, first_name, last_name')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (adminUserError) {
            console.error("Error checking admin_users table:", adminUserError);
            toast({
              title: "Admin Check Failed",
              description: "Could not verify admin database entry: " + adminUserError.message,
              variant: "destructive"
            });
          }
          
          const displayedInList = !!adminUserRecord;
          console.log("User is displayed in admin list:", displayedInList);
          
          setCurrentUser({
            id: userId,
            email,
            isAdmin,
            displayedInList,
            first_name: adminUserRecord?.first_name || undefined
          });
        } catch (adminListError) {
          console.error("Error checking admin list:", adminListError);
        }
      } else {
        setCurrentUser({
          id: userId,
          email,
          isAdmin,
          displayedInList: false
        });
      }
      
      // Always set loading to false when done
      setLoading(false);
    } catch (err: any) {
      console.error("Error in fetchCurrentUserInfo:", err);
      setError("Failed to get user information: " + err.message);
      toast({
        title: "User Info Error",
        description: "Failed to fetch your user information: " + err.message,
        variant: "destructive"
      });
      // Always set loading to false on error
      setLoading(false);
    }
  }, [toast]);

  // Fix admin status for current user
  const fixAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      if (!currentUser.id || !currentUser.email) {
        console.error("Cannot fix admin status: User ID or email is missing");
        toast({
          title: "Error Fixing Admin Status",
          description: "Missing user ID or email information",
          variant: "destructive"
        });
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
        toast({
          title: "Admin Check Failed",
          description: "Could not verify existing admin status: " + checkError.message,
          variant: "destructive"
        });
        throw new Error(`Failed to check admin status: ${checkError.message}`);
      }
      
      if (existingAdmin) {
        console.log("User already exists in admin_users table:", existingAdmin);
        
        // Update currentUser state to show as displayed
        setCurrentUser(prev => ({
          ...prev,
          displayedInList: true
        }));
        
        toast({
          title: "Admin Status Verified",
          description: "Your admin status has been confirmed",
        });
        
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
        toast({
          title: "Failed to Add Admin Role",
          description: error || "An error occurred while trying to add admin role",
          variant: "destructive"
        });
        throw new Error(`Failed to add admin role: ${error}`);
      }
      
      console.log("Admin role added successfully");
      toast({
        title: "Admin Status Fixed",
        description: "You have been successfully added to the admin users list",
      });
      
      // Update currentUser state
      setCurrentUser(prev => ({
        ...prev,
        displayedInList: true
      }));
      
      return true;
    } catch (err: any) {
      console.error("Error in fixAdminStatus:", err);
      toast({
        title: "Error Fixing Admin Status",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw err; // Re-throw to allow caller to handle error properly
    }
  }, [currentUser, toast]);

  // Get current user on mount - only once
  useEffect(() => {
    fetchCurrentUserInfo().catch(err => {
      console.error("Error in initial fetch of user info:", err);
    });
  }, [fetchCurrentUserInfo]);

  return {
    currentUser,
    setCurrentUser,
    loading,
    error,
    fixAdminStatus,
    fetchCurrentUserInfo,
  };
}
