
import { useState, useEffect, useCallback } from "react";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useFetchAdmins } from "@/hooks/useFetchAdmins";
import { useAdminActions } from "@/hooks/useAdminActions";
import { AdminUser } from "@/types/adminTypes";

export type { AdminUser };

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

  // Use a stable reference for the fetchAdminsAndUpdateStatus function
  const fetchAdminsAndUpdateStatus = useCallback(async () => {
    console.log("Fetching admins and updating status");
    const result = await fetchAdmins();
    if (result && 'isCurrentUserDisplayed' in result) {
      setCurrentUser(prev => ({
        ...prev,
        displayedInList: result.isCurrentUserDisplayed
      }));
    }
    return result;
  }, [fetchAdmins, setCurrentUser]);

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
    if (!currentUser.id) return false;
    return await updateName(firstName, lastName, currentUser.id);
  };

  // Handle fixing current user's admin status
  const handleFixCurrentUserAdmin = async () => {
    const success = await fixAdminStatus();
    if (success) {
      // After fixing admin status, refresh the admin list
      await fetchAdminsAndUpdateStatus();
    }
    return success;
  };

  // Load admin users on mount only once
  useEffect(() => {
    console.log("useAdminUsers: Initial fetch of admin users");
    fetchAdminsAndUpdateStatus();
    // Intentionally empty dependency array to run only once on mount
  }, []);

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
