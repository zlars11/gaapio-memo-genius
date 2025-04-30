import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { removeAdminRole, updateAdminName } from "@/utils/adminRoleUtils";
import { supabase } from "@/integrations/supabase/client";

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

  const handleUpdateName = async (firstName: string, lastName: string, email: string) => {
    try {
      setUpdatingName(true);
      
      if (!email) {
        throw new Error("No email available");
      }
      
      console.log("Updating name for admin user with email:", email);
      console.log("New values:", { firstName, lastName, email });
      
      // Find the user ID from email if needed
      let userId = null;
      
      // Check if we need to find the user from auth by email
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session?.user?.id) {
        userId = data.session.user.id;
        console.log("Got user ID from session:", userId);
      }
      
      if (!userId) {
        throw new Error("Could not determine the user ID");
      }
      
      const success = await updateAdminName(userId, firstName, lastName, email);
      
      if (success) {
        toast({
          title: "Information updated",
          description: "Your information has been updated successfully.",
        });
        
        // Update complete admin list
        await onUpdate();
        setNameDialogOpen(false);
        return true;
      } else {
        throw new Error("Failed to update information");
      }
    } catch (error: any) {
      console.error("Error updating name and email:", error);
      toast({
        title: "Failed to update information",
        description: error.message || "An error occurred while trying to update your information.",
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
