
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { User } from "./types/userTypes";
import { UserRow } from "./UserRow";

interface UsersTableContentProps {
  loading: boolean;
  items: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  searchQuery: string;
}

export function UsersTableContent({ 
  loading, 
  items, 
  onEdit,
  onDelete,
  searchQuery 
}: UsersTableContentProps) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Sign-up Date</TableHead>
          <TableHead>User Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Loading...
            </TableCell>
          </TableRow>
        ) : items.length > 0 ? (
          items.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              {searchQuery ? "No matching users found." : "No users have signed up yet."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
}
