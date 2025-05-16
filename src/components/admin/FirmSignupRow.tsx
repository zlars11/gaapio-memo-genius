
import { FirmSignup } from "./types/userTypes";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";

interface FirmSignupRowProps {
  signup: FirmSignup;
  onEdit: (signup: FirmSignup) => void;
}

export function FirmSignupRow({ signup, onEdit }: FirmSignupRowProps) {
  const handleEditClick = () => {
    onEdit(signup);
  };
  
  return (
    <TableRow>
      <TableCell className="font-medium">
        {signup.company || "Not provided"}
      </TableCell>
      <TableCell>
        {signup.first_name || signup.last_name
          ? `${signup.first_name || ""} ${signup.last_name || ""}`
          : "Not provided"}
      </TableCell>
      <TableCell>{signup.email || "Not provided"}</TableCell>
      <TableCell>{signup.phone || "Not provided"}</TableCell>
      <TableCell>
        {formatDate(signup.created_at)}
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditClick}
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}
