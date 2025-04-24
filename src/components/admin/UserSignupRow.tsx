
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { UserSignupRowProps } from "./types/userTypes";

export function UserSignupRow({ user, onEdit }: UserSignupRowProps) {
  const getStatusBadgeVariant = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "default";
      case "trial":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <TableRow key={user.id || user.email}>
      <TableCell className="font-medium">{user.firstname || "—"}</TableCell>
      <TableCell>{user.lastname || "—"}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.company || "—"}</TableCell>
      <TableCell>{user.plan}</TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(user.status)}>
          {user.status
            ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
            : "Active"}
        </Badge>
      </TableCell>
      <TableCell>
        {user.signupdate
          ? new Date(user.signupdate).toLocaleDateString()
          : "—"}
      </TableCell>
      <TableCell align="right">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => onEdit(user)}
        >
          <Pen className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}
