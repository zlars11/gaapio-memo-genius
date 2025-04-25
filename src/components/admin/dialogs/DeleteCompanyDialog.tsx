
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteCompanyDialogProps {
  deletePassword: string;
  deleteError: string;
  onClose: () => void;
  onConfirm: () => void;
  onPasswordChange: (password: string) => void;
}

export function DeleteCompanyDialog({
  deletePassword,
  deleteError,
  onClose,
  onConfirm,
  onPasswordChange,
}: DeleteCompanyDialogProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Company</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this company? This action will also delete all associated users and cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <div className="py-4">
        <Label htmlFor="deletePassword">
          Enter password to confirm deletion
        </Label>
        <Input
          id="deletePassword"
          type="password"
          value={deletePassword}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter 'admin123' to confirm"
          className="mt-2"
        />
        {deleteError && (
          <p className="text-sm text-destructive mt-1">{deleteError}</p>
        )}
      </div>
      
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => {
          onPasswordChange("");
          onClose();
        }}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction 
          onClick={onConfirm}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
