
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { UserSignupRow } from "./UserSignupRow";
import EditUserDialog from "./EditUserDialog";
import { UserSignup } from "./types/userTypes";

export function UserSignupsTable() {
  const [users, setUsers] = useState<UserSignup[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSignup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<UserSignup | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { 
    currentItems: paginatedUsers,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    goToPage
  } = usePagination({
    items: filteredUsers,
    initialItemsPerPage: 10
  });

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

  const handleOpenEdit = (user: UserSignup) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setDialogOpen(false);
  };

  const handleSaveUser = async (updatedUser: UserSignup) => {
    try {
      const { error } = await supabase
        .from("user_signups")
        .update({
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          phone: updatedUser.phone,
          company: updatedUser.company,
          plan: updatedUser.plan,
          term: updatedUser.term,
          status: updatedUser.status
        })
        .eq("id", updatedUser.id);
      
      if (error) throw error;
      
      // Refresh the user data
      const { data, error: fetchError } = await supabase
        .from("user_signups")
        .select("*")
        .order("signupdate", { ascending: false });
      
      if (!fetchError && data) {
        setUsers(data as UserSignup[]);
        setFilteredUsers(data as UserSignup[]);
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_signups")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
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
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <UserSignupRow
                  key={user.id}
                  user={user}
                  onEdit={handleOpenEdit}
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
        </Table>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {editUser && (
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <EditUserDialog
                user={editUser}
                onSave={handleSaveUser}
                onDelete={() => handleDeleteUser(editUser.id)}
                onClose={handleCloseEdit}
              />
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
}
