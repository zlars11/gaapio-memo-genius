
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { UserSignup } from "../types/userTypes";
import EditUserDialog from "../EditUserDialog";
import { formatDate } from "@/lib/utils";

interface CompanyUsersFormProps {
  users: UserSignup[];
  companyId: string;
  companyName: string;
  companyPlan: string;
  onUserUpdate: () => void;
  loadingUsers?: boolean;
  createUserDialogOpen: boolean;
  setCreateUserDialogOpen: (open: boolean) => void;
  newUser: Partial<UserSignup>;
  setNewUser: (user: Partial<UserSignup>) => void;
  handleCreateUser: () => void;
  handleEditUser: (user: UserSignup) => void;
  handleSaveUser: (user: UserSignup) => void;
  handleDeleteUser: (userId: string) => void;
  editUser: UserSignup | null;
  userDialogOpen: boolean;
  setUserDialogOpen: (open: boolean) => void;
}

export function CompanyUsersForm({
  users,
  companyId,
  companyName,
  companyPlan,
  onUserUpdate,
  loadingUsers = false,
  createUserDialogOpen,
  setCreateUserDialogOpen,
  newUser,
  setNewUser,
  handleCreateUser,
  handleEditUser,
  handleSaveUser,
  handleDeleteUser,
  editUser,
  userDialogOpen,
  setUserDialogOpen,
}: CompanyUsersFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Company Users</h3>
        <Button 
          size="sm" 
          onClick={() => setCreateUserDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>
      
      {loadingUsers ? (
        <div className="text-center py-4">Loading users...</div>
      ) : users.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sign-up Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstname || ''} ${user.lastname || ''}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role || 'member'}</TableCell>
                <TableCell className="capitalize">{user.status || 'active'}</TableCell>
                <TableCell>{user.signupdate ? formatDate(user.signupdate) : 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit user</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No users found for this company.
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        {editUser && (
          <DialogContent className="sm:max-w-[600px]">
            <EditUserDialog
              user={editUser}
              onSave={handleSaveUser}
              onDelete={() => handleDeleteUser(editUser.id)}
              onClose={() => setUserDialogOpen(false)}
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
