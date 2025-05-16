
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "../types/userTypes";

interface DeleteUserDialogProps {
  user: User;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteUserDialog({ user, onDelete, onClose }: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully."
      });
      
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        <div className="bg-muted p-4 rounded-md mb-6">
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User Type:</strong> {user.user_type}</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete User"}
        </Button>
      </div>
    </div>
  );
}
