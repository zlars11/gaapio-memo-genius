
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
import EditUserDialog from "../EditUserDialog";
import { formatDate } from "@/lib/utils";
import { User } from "../types/userTypes";
import { NormalizedUser } from "../types/normalizedTypes";
import { Dispatch, SetStateAction } from "react";

interface CompanyUsersFormProps {
  users: NormalizedUser[];
  companyId: string;
  companyName: string;
  companyPlan: string;
  loadingUsers?: boolean;
  createUserDialogOpen: boolean;
  setCreateUserDialogOpen: (open: boolean) => void;
  newUser?: Partial<User>;
  setNewUser?: (user: Partial<User> | ((prev: Partial<User>) => Partial<User>)) => void;
  handleCreateUser?: () => void;
  handleEditUser: (user: NormalizedUser) => void;
  handleSaveUser: (user: User) => void;
  handleDeleteUser: (userId: string) => void;
  editUser: NormalizedUser | null;
  userDialogOpen: boolean;
  setUserDialogOpen: (open: boolean) => void;
  setEditUser: Dispatch<SetStateAction<NormalizedUser | null>>;
}

export function CompanyUsersForm({
  users,
  companyId,
  companyName,
  companyPlan,
  loadingUsers = false,
  createUserDialogOpen,
  setCreateUserDialogOpen,
  newUser = {},
  setNewUser = () => {},
  handleCreateUser = () => {},
  handleEditUser,
  handleSaveUser,
  handleDeleteUser,
  editUser,
  userDialogOpen,
  setUserDialogOpen,
  setEditUser,
}: CompanyUsersFormProps) {
  const [formErrors, setFormErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      first_name?: string;
      last_name?: string;
      email?: string;
    } = {};
    
    if (!newUser.first_name) errors.first_name = "First name is required";
    if (!newUser.last_name) errors.last_name = "Last name is required";
    
    if (!newUser.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = "Email is invalid";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleCreateUser();
    }
  };

  const handleChange = (name: string, value: string) => {
    setNewUser((prev) => {
      return { ...prev, [name]: value };
    });
    
    // Clear the error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
              <TableHead>User Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{`${user.first_name || ''} ${user.last_name || ''}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.user_type || 'user'}</TableCell>
                <TableCell className="capitalize">{user.status || 'active'}</TableCell>
                <TableCell>{user.created_at ? formatDate(new Date(user.created_at)) : 'N/A'}</TableCell>
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

      {/* Create User Dialog */}
      <Dialog open={createUserDialogOpen} onOpenChange={setCreateUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="first_name"
                  value={newUser.first_name || ''}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className={formErrors.first_name ? "border-red-500" : ""}
                />
                {formErrors.first_name && (
                  <p className="text-xs text-red-500">{formErrors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="last_name"
                  value={newUser.last_name || ''}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className={formErrors.last_name ? "border-red-500" : ""}
                />
                {formErrors.last_name && (
                  <p className="text-xs text-red-500">{formErrors.last_name}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={newUser.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newUser.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user_type">User Type</Label>
              <Select
                value={newUser.user_type || 'user'}
                onValueChange={(value) => handleChange('user_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="approver">Approver</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newUser.status || 'active'}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Hidden fields with company info */}
            <input type="hidden" name="company_id" value={companyId} />
            <input type="hidden" name="company" value={companyName} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        {editUser && (
          <DialogContent className="sm:max-w-[600px]">
            <EditUserDialog
              user={editUser as User}
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
