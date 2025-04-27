
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { User } from "./types/userTypes";

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UserRow({ user, onEdit }: UserRowProps) {
  return (
    <TableRow key={user.id}>
      <TableCell>{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
      <TableCell>{user.user_type}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
        >
          <Pen className="w-4 h-4 mr-1" /> Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}
