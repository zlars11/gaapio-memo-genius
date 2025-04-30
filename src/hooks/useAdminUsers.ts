
import { useState, useEffect, useCallback } from "react";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useFetchAdmins } from "@/hooks/useFetchAdmins";
import { useAdminActions } from "@/hooks/useAdminActions";
import { AdminUser } from "@/types/adminTypes";
import { useToast } from "@/components/ui/use-toast";

export function useAdminUsers() {
  const {
    currentUser,
    setCurrentUser,
    loading: currentUserLoading,
    error: currentUserError,
    fixAdminStatus
  } = useCurrentAdmin();

  const {
    admins,
    loading: adminsLoading,
    error: adminsError,
    fetchAdmins,
    setAdmins
  } = useFetchAdmins(currentUser);

  const { toast } = useToast();

  // Fetch admins and update display status
  const fetchAdminsAndUpdateStatus = useCallback(async () => {
    try {
      console.log("Fetching admins and updating status");
      const result = await fetchAdmins();
      
      if (result && 'isCurrentUserDisplayed' in result) {
        setCurrentUser(prev => ({
          ...prev,
          displayedInList: result.isCurrentUserDisplayed
        }));
      }
      
      return result;
    } catch (error: any) {
      console.error("Error in fetchAdminsAndUpdateStatus:", error);
      toast({
        title: "Error fetching admins",
        description: error.message || "Failed to fetch admin users",
        variant: "destructive",
      });
      return { success: false, isCurrentUserDisplayed: false };
    }
  }, [fetchAdmins, setCurrentUser, toast]);

  const {
    removing,
    updatingName,
    nameDialogOpen,
    setNameDialogOpen,
    handleRemoveAdmin,
    handleUpdateName: updateName
  } = useAdminActions(fetchAdminsAndUpdateStatus);

  // Handle updating name with the current user ID
  const handleUpdateName = async (firstName: string, lastName: string): Promise<boolean> => {
    if (!currentUser.email) return false;
    return await updateName(firstName, lastName, currentUser.email);
  };

  // Handle fixing current user's admin status
  const handleFixCurrentUserAdmin = async () => {
    try {
      const success = await fixAdminStatus();
      
      if (success) {
        toast({
          title: "Admin status fixed",
          description: "Your admin status has been updated successfully.",
        });
        
        // After fixing admin status, refresh the admin list
        await fetchAdminsAndUpdateStatus();
      } else {
        toast({
          title: "Failed to fix admin status",
          description: "An error occurred while trying to update your admin status.",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error: any) {
      console.error("Error fixing admin status:", error);
      toast({
        title: "Error fixing admin status",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load admin users on mount
  useEffect(() => {
    // Delay the initial fetch slightly to ensure auth state is ready
    const timer = setTimeout(() => {
      console.log("useAdminUsers: Initial fetch of admin users");
      fetchAdminsAndUpdateStatus();
    }, 300); // Short delay to allow auth to initialize
    
    return () => clearTimeout(timer);
  }, [fetchAdminsAndUpdateStatus]);

  const loading = currentUserLoading || adminsLoading;
  const fetchError = currentUserError || adminsError;

  return {
    loading,
    admins,
    removing,
    currentUserIsAdmin: currentUser.isAdmin,
    currentUserDisplayed: currentUser.displayedInList,
    fetchError,
    currentUserEmail: currentUser.email,
    currentUserId: currentUser.id,
    updatingName,
    nameDialogOpen,
    setNameDialogOpen,
    handleRemoveAdmin,
    handleFixCurrentUserAdmin,
    handleUpdateName,
    fetchAdmins: fetchAdminsAndUpdateStatus,
  };
}
