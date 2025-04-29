
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkAdminRole, addAdminRole } from "@/utils/adminRoleUtils";
import { useToast } from "@/components/ui/use-toast";

export interface CurrentAdminUser {
  id: string | null;
  email: string | null;
  isAdmin: boolean;
  displayedInList: boolean;
}

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

  useEffect(() => {
    const loadCurrentUserStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError("Failed to fetch your session information");
          return;
        }
        
        if (!session?.user) {
          console.log("No current user session found");
          setCurrentUser({
            id: null,
            email: null,
            isAdmin: false,
            displayedInList: false
          });
          return;
        }
        
        const userId = session.user.id;
        const userEmail = session.user.email;
        
        console.log("Current user found:", userEmail);
        
        // Check if user has admin role
        const isAdmin = await checkAdminRole(userId);
        
        setCurrentUser({
          id: userId,
          email: userEmail,
          isAdmin,
          displayedInList: false // Will be updated when admin list is fetched
        });
      } catch (e) {
        console.error("Unexpected error in loadCurrentUserStatus:", e);
        setError("An unexpected error occurred while checking your admin status");
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUserStatus();
  }, []);

  const fixAdminStatus = async () => {
    if (!currentUser.id) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to perform this action.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("Fixing admin status for user:", currentUser.id);
      
      // Add default name for Zack Larsen when fixing admin status
      const firstName = "Zack";
      const lastName = "Larsen";
      
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
  };

  return {
    currentUser,
    setCurrentUser,
    loading,
    error,
    fixAdminStatus
  };
}
