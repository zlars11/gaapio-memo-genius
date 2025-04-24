
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { FirmSignupRowProps } from "./types/userTypes";

export function FirmSignupRow({ signup, onEdit }: FirmSignupRowProps) {
  return (
    <TableRow key={signup.id}>
      <TableCell>{signup.company}</TableCell>
      <TableCell>{`${signup.firstname || ''} ${signup.lastname || ''}`.trim()}</TableCell>
      <TableCell>{signup.email}</TableCell>
      <TableCell>{signup.phone}</TableCell>
      <TableCell>{signup.signupdate ? new Date(signup.signupdate).toLocaleDateString() : 'N/A'}</TableCell>
      <TableCell>{signup.plan}</TableCell>
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
