
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { FirmSignupRowProps } from "./types/userTypes";

export function FirmSignupRow({ signup, onEdit, onDelete }: FirmSignupRowProps) {
  return (
    <TableRow key={signup.id}>
      <TableCell>{signup.company}</TableCell>
      <TableCell>{`${signup.first_name || ''} ${signup.last_name || ''}`.trim()}</TableCell>
      <TableCell>{signup.email}</TableCell>
      <TableCell>{signup.phone}</TableCell>
      <TableCell>{signup.created_at ? new Date(signup.created_at).toLocaleDateString() : 'N/A'}</TableCell>
      <TableCell className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(signup)}
          className="h-8"
        >
          <Edit className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(signup)}
          className="h-8 text-destructive border-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
