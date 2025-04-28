
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DemoRequestFormData } from "@/components/demo/types/demoRequestTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DeleteDemoConfirmDialogProps {
  request: DemoRequestFormData & { id: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteDemoConfirmDialog({
  request,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDemoConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("demo_requests")
      .delete()
      .eq("id", request.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete demo request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Demo request deleted successfully",
      });
      onSuccess();
      onOpenChange(false);
    }
    setIsLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Demo Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the demo request for {request.firstName}{" "}
            {request.lastName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
