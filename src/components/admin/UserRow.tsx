
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { User } from "./types/userTypes";

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  const formattedDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A";

  return (
    <TableRow key={user.id}>
      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone || "—"}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{user.user_type}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit user</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete user</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
