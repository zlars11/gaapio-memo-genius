
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "@/components/admin/types/companyTypes";

interface DeleteCompanyDialogProps {
  company: Company;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteCompanyDialog({ company, onDelete, onClose }: DeleteCompanyDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", company.id);
        
      if (error) throw error;
      
      toast({
        title: "Company deleted",
        description: "The company has been deleted successfully."
      });
      
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete company",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this company? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        <div className="bg-muted p-4 rounded-md mb-6">
          <p><strong>Company:</strong> {company.name}</p>
          <p><strong>Plan:</strong> {company.plan}</p>
          <p><strong>Status:</strong> {company.status}</p>
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
          {isDeleting ? "Deleting..." : "Delete Company"}
        </Button>
      </div>
    </div>
  );
}
