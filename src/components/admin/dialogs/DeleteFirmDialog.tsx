
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FirmSignup } from "../types/userTypes";

interface DeleteFirmDialogProps {
  firm: FirmSignup;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteFirmDialog({ firm, onDelete, onClose }: DeleteFirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", firm.id);
        
      if (error) throw error;
      
      toast({
        title: "Firm deleted",
        description: "The firm has been deleted successfully."
      });
      
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete firm",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>Delete Firm</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this firm? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        <div className="bg-muted p-4 rounded-md mb-6">
          <p><strong>Company:</strong> {firm.company}</p>
          <p><strong>Contact:</strong> {firm.first_name} {firm.last_name}</p>
          <p><strong>Email:</strong> {firm.email}</p>
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
          {isDeleting ? "Deleting..." : "Delete Firm"}
        </Button>
      </div>
    </div>
  );
}
