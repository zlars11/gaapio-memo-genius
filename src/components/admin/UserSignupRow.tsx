
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { UserSignup } from "./types/userTypes";

interface UserSignupRowProps {
  user: UserSignup;
  onEdit: (user: UserSignup) => void;
}

export function UserSignupRow({ user, onEdit }: UserSignupRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableRow>
      <TableCell>{user.firstname}</TableCell>
      <TableCell>{user.lastname}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.company}</TableCell>
      <TableCell className="capitalize">{user.plan}</TableCell>
      <TableCell className="capitalize">{user.role || 'member'}</TableCell>
      <TableCell className="capitalize">{user.status}</TableCell>
      <TableCell>{formatDate(user.signupdate)}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(user)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit user</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
