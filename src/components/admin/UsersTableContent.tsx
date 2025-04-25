import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { User } from "./types/userTypes";
import { UserRow } from "./UserRow";

interface UsersTableContentProps {
  loading: boolean;
  items: User[];
  onEdit: (user: User) => void;
  searchQuery: string;
}

export function UsersTableContent({ 
  loading, 
  items, 
  onEdit,
  searchQuery 
}: UsersTableContentProps) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sign-up Date</TableHead>
          <TableHead className="text-right">Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
              Loading...
            </TableCell>
          </TableRow>
        ) : items.length > 0 ? (
          items.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={onEdit}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
              {searchQuery ? "No matching users found." : "No users have signed up yet."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
}
