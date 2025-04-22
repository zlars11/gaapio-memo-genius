
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Button } from "@/components/ui/button";
import EditUserDialog from "./EditUserDialog";
import { Pen } from "lucide-react";

interface UserSignup {
  id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  company?: string;
  plan: string;
  status?: string;
  amount?: string;
  signupdate?: string;
}

export function UserSignupsTable() {
  const [users, setUsers] = useState<UserSignup[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSignup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<UserSignup | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_signups")
        .select("*")
        .order("signupdate", { ascending: false });
      if (error) {
        setUsers([]);
        setFilteredUsers([]);
      } else {
        setUsers(data as UserSignup[]);
        setFilteredUsers(data as UserSignup[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user: UserSignup) =>
          (user.firstname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.lastname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.plan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.company || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

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

  const handleOpenEdit = (user: UserSignup) => {
    setEditUser(user);
  };

  const handleCloseEdit = (changed: boolean) => {
    setEditUser(null);
    if (changed) {
      // refetch
      (async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("user_signups")
          .select("*")
          .order("signupdate", { ascending: false });
        setUsers(data || []);
        setFilteredUsers(data || []);
        setLoading(false);
      })();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Sign-ups</CardTitle>
        <CardDescription>
          Users who have subscribed to a paid plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by name, email, company, or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Table>
          <TableCaption>A list of users who have signed up.</TableCaption>
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
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <TableRow key={user.id || user.email || idx}>
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
                      onClick={() => handleOpenEdit(user)}
                    >
                      <Pen className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  {searchQuery ? "No matching users found." : "No users have signed up yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {editUser && (
          <EditUserDialog
            user={editUser}
            open={!!editUser}
            onClose={handleCloseEdit}
          />
        )}
      </CardContent>
    </Card>
  );
}
