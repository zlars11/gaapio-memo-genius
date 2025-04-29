
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { AdminUser } from "@/hooks/useAdminUsers";
import { AdminUserRow } from "./AdminUserRow";

interface AdminUsersTableProps {
  loading: boolean;
  admins: AdminUser[];
  removing: string | null;
  onRemoveAdmin: (adminId: string) => void;
}

export function AdminUsersTable({ loading, admins, removing, onRemoveAdmin }: AdminUsersTableProps) {
  return (
    <Table>
      <TableCaption>All users with admin access</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Added On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <span className="mt-2 block text-muted-foreground">Loading admin users...</span>
            </TableCell>
          </TableRow>
        ) : admins.length > 0 ? (
          admins.map((admin) => (
            <AdminUserRow 
              key={admin.id}
              admin={admin}
              isRemoving={removing === admin.id}
              onRemove={() => onRemoveAdmin(admin.id)}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              <span className="text-muted-foreground">No admin users found</span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
