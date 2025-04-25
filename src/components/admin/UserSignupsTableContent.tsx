
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserSignup } from "./types/userTypes";
import { UserSignupRow } from "./UserSignupRow";

interface UserSignupsTableContentProps {
  loading: boolean;
  items: UserSignup[];
  onEdit: (user: UserSignup) => void;
  searchQuery: string;
}

export function UserSignupsTableContent({ 
  loading, 
  items, 
  onEdit,
  searchQuery 
}: UserSignupsTableContentProps) {
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
            <UserSignupRow
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
