
import { useState, useEffect } from "react";
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

  const fetchAdminsAndUpdateStatus = async () => {
    const result = await fetchAdmins();
    if (result && 'isCurrentUserDisplayed' in result) {
      setCurrentUser(prev => ({
        ...prev,
        displayedInList: result.isCurrentUserDisplayed
      }));
    }
    return result;
  };

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

  // Load admin users on mount
  useEffect(() => {
    fetchAdminsAndUpdateStatus();
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
    handleFixCurrentUserAdmin: fixAdminStatus,
    handleUpdateName,
    fetchAdmins: fetchAdminsAndUpdateStatus,
  };
}
