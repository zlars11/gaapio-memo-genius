
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { FirmSignupRowProps } from "./types/userTypes";

export function FirmSignupRow({ signup, onEdit }: FirmSignupRowProps) {
  return (
    <TableRow key={signup.id}>
      <TableCell>{signup.company}</TableCell>
      <TableCell>{`${signup.first_name || ''} ${signup.last_name || ''}`.trim()}</TableCell>
      <TableCell>{signup.email}</TableCell>
      <TableCell>{signup.phone}</TableCell>
      <TableCell>{signup.created_at ? new Date(signup.created_at).toLocaleDateString() : 'N/A'}</TableCell>
      <TableCell>{signup.user_type}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(signup)}
        >
          <Pen className="w-4 h-4 mr-1" /> Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}
