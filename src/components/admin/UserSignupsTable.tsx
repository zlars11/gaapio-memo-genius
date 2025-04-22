import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface UserSignup {
  id: string;
  name?: string;
  email: string;
  plan: string;
  status?: "active" | "inactive" | "trial";
  signupDate: string;
}

export function UserSignupsTable() {
  const [users, setUsers] = useState<UserSignup[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSignup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load user signups from localStorage
    const savedUsers = localStorage.getItem("userSignups");
    if (savedUsers) {
      let parsed = [];
      try {
        parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed)) {
          parsed = parsed.map((u: any, idx) => ({
            id: u.id || `auto_${(u.email || "")}_${idx}`,
            name: u.name || "",
            email: u.email || "",
            plan: u.plan || (u.amount && u.amount.includes("Annual") ? "Annual" : "Monthly"),
            status: u.status || "active",
            signupDate: u.signupDate || u.date || new Date().toISOString(),
          }));
        }
      } catch (err) {
        parsed = [];
      }
      setUsers(parsed);
      setFilteredUsers(parsed);
    } else {
      setUsers([]);
      setFilteredUsers([]);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.plan || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const getStatusBadgeVariant = (status: UserSignup['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Sign-ups</CardTitle>
        <CardDescription>
          Users who have signed up for a paid plan via Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by name, email or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Table>
          <TableCaption>A list of users who have signed up.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sign-up Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <TableRow key={user.id || user.email || idx}>
                  <TableCell className="font-medium">{user.name || "—"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status || "active")}>
                      {user.status ? (user.status.charAt(0).toUpperCase() + user.status.slice(1)) : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.signupDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  {searchQuery ? "No matching users found." : "No users have signed up yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
