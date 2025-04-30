
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole } from "@/utils/adminUtils";
import { addAdminRole } from "@/utils/adminRoleUtils";
import { useToast } from "@/components/ui/use-toast";
import { SupabaseAuthUser } from "@/types/supabaseTypes";
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
  const { toast } = useToast();

  // Load current user info on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadCurrentUserStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          if (isMounted) {
            setError("Failed to fetch your session information");
          }
          return;
        }
        
        if (!session?.user) {
          console.log("No current user session found");
          if (isMounted) {
            setCurrentUser({
              id: null,
              email: null,
              isAdmin: false,
              displayedInList: false
            });
          }
          return;
        }
        
        const userId = session.user.id;
        const userEmail = session.user.email;
        
        console.log("Current user found:", userEmail);
        
        // Check if user has admin role
        const isAdmin = await checkAdminRole(userId);
        
        if (isMounted) {
          setCurrentUser({
            id: userId,
            email: userEmail,
            isAdmin,
            displayedInList: false // Will be updated when admin list is fetched
          });
        }
      } catch (e) {
        console.error("Unexpected error in loadCurrentUserStatus:", e);
        if (isMounted) {
          setError("An unexpected error occurred while checking your admin status");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCurrentUserStatus();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Use a stable reference for the fixAdminStatus function
  const fixAdminStatus = useCallback(async () => {
    if (!currentUser.id || !currentUser.email) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to perform this action.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("Fixing admin status for user:", currentUser.id);
      
      // Get user metadata if available
      const { data, error: userError } = await supabase.auth.getUser();
      
      // Extract name from user metadata or use defaults
      let firstName = "Admin";
      let lastName = "User";
      
      if (!userError && data?.user) {
        // Properly typed access to user metadata
        const user = data.user as SupabaseAuthUser;
        
        if (user.user_metadata) {
          firstName = (user.user_metadata.first_name as string) || firstName;
          lastName = (user.user_metadata.last_name as string) || lastName;
        }
      }
      
      // Add admin role with the user's name
      const success = await addAdminRole(currentUser.id, firstName, lastName);
      
      if (success) {
        toast({
          title: "Admin role fixed",
          description: "You've been properly added to the admin users list.",
        });
        return true;
      } else {
        toast({
          title: "Failed to fix admin status",
          description: "An error occurred while trying to update your admin status.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error("Error fixing admin status:", error);
      toast({
        title: "Failed to fix admin status",
        description: error.message || "An error occurred while trying to update your admin status.",
        variant: "destructive",
      });
      return false;
    }
  }, [currentUser.id, currentUser.email, toast]);

  return {
    currentUser,
    setCurrentUser,
    loading,
    error,
    fixAdminStatus
  };
}
