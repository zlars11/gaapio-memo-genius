
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteCompanyDialogProps {
  deletePassword: string;
  deleteError: string;
  onClose: () => void;
  onConfirm: () => void;
  onPasswordChange: (value: string) => void;
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
          This action is irreversible. Please enter the admin password to confirm.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-4">
        <Input
          type="password"
          placeholder="Admin password"
          value={deletePassword}
          onChange={(e) => onPasswordChange(e.target.value)}
          className={deleteError ? "border-red-500" : ""}
        />
        {deleteError && (
          <p className="text-sm text-red-500 mt-1">{deleteError}</p>
        )}
      </div>
      <AlertDialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete Company
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
