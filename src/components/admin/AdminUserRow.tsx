
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UserX, UserCog } from "lucide-react";
import { AdminUser } from "@/hooks/useAdminUsers";

interface AdminUserRowProps {
  admin: AdminUser;
  isRemoving: boolean;
  onRemove: () => void;
  isCurrentUser: boolean;
  onUpdateName?: () => void;
}

export function AdminUserRow({ 
  admin, 
  isRemoving, 
  onRemove, 
  isCurrentUser,
  onUpdateName 
}: AdminUserRowProps) {
  const hasName = admin.first_name || admin.last_name;
  
  return (
    <TableRow key={admin.id}>
      <TableCell>
        {hasName 
          ? `${admin.first_name || ''} ${admin.last_name || ''}`.trim() 
          : 'N/A'}
        {isCurrentUser && !hasName && onUpdateName && (
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={onUpdateName}
          >
            <UserCog className="h-4 w-4 mr-1" />
            Update Name
          </Button>
        )}
      </TableCell>
      <TableCell>{admin.email}</TableCell>
      <TableCell>
        {new Date(admin.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onRemove}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <UserX className="h-4 w-4 mr-1" />
          )}
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}
