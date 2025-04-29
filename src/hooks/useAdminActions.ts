
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { removeAdminRole, updateAdminName } from "@/utils/adminRoleUtils";
import { AdminUser } from "@/types/adminTypes";

export function useAdminActions(onUpdate: () => Promise<any>) {
  const [removing, setRemoving] = useState<string | null>(null);
  const [updatingName, setUpdatingName] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      setRemoving(adminId);
      
      const success = await removeAdminRole(adminId);
      
      if (success) {
        toast({
          title: "Admin removed",
          description: "Admin privileges have been revoked from this user.",
        });
        
        // Refresh admin list
        await onUpdate();
        return true;
      } else {
        toast({
          title: "Failed to remove admin",
          description: "An error occurred while trying to remove admin privileges.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error("Error in handleRemoveAdmin:", error);
      toast({
        title: "Failed to remove admin",
        description: error.message || "An error occurred while trying to remove admin privileges.",
        variant: "destructive",
      });
      return false;
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateName = async (firstName: string, lastName: string, userId: string) => {
    try {
      setUpdatingName(true);
      
      if (!userId) {
        throw new Error("No user ID available");
      }
      
      console.log("Updating name for admin user:", userId);
      console.log("New name values:", { firstName, lastName });
      
      const success = await updateAdminName(userId, firstName, lastName);
      
      if (success) {
        toast({
          title: "Name updated",
          description: "Your name has been updated successfully.",
        });
        
        // Update complete admin list
        await onUpdate();
        setNameDialogOpen(false);
        return true;
      } else {
        throw new Error("Failed to update name");
      }
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast({
        title: "Failed to update name",
        description: error.message || "An error occurred while trying to update your name.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdatingName(false);
    }
  };

  return {
    removing,
    updatingName,
    nameDialogOpen,
    setNameDialogOpen,
    handleRemoveAdmin,
    handleUpdateName
  };
}
