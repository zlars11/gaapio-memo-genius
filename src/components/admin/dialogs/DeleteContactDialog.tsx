
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ContactSubmission {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  message: string;
  date: string;
}

interface DeleteContactDialogProps {
  contact: ContactSubmission;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteContactDialog({ contact, onDelete, onClose }: DeleteContactDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", contact.id);
        
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      toast({
        title: "Contact deleted",
        description: "The contact submission has been deleted successfully."
      });
      
      onDelete();
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>Delete Contact Submission</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this contact submission? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        <div className="bg-muted p-4 rounded-md mb-6">
          <p><strong>Name:</strong> {contact.firstname} {contact.lastname}</p>
          <p><strong>Email:</strong> {contact.email}</p>
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
          {isDeleting ? "Deleting..." : "Delete Contact"}
        </Button>
      </div>
    </div>
  );
}
