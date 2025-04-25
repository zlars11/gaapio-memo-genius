
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DeleteUserConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteUserConfirmDialog({ onConfirm, onCancel }: DeleteUserConfirmDialogProps) {
  return (
    <div className="mt-4 p-4 border border-destructive/20 bg-destructive/5 rounded-md">
      <Label htmlFor="delete-passcode" className="text-destructive">
        Confirm user deletion:
      </Label>
      <div className="flex gap-2 mt-2">
        <Button type="button" variant="destructive" onClick={onConfirm}>
          Confirm Delete
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
