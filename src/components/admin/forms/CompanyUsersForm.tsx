import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  setNewUser: (user: Partial<UserSignup> | ((prev: Partial<UserSignup>) => Partial<UserSignup>)) => void;
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
  const [formErrors, setFormErrors] = useState<{
    firstname?: string;
    lastname?: string;
    email?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      firstname?: string;
      lastname?: string;
      email?: string;
    } = {};
    
    if (!newUser.firstname) errors.firstname = "First name is required";
    if (!newUser.lastname) errors.lastname = "Last name is required";
    
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
    // Fix the setState call by correctly using the functional update pattern
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

      {/* Create User Dialog */}
      <Dialog open={createUserDialogOpen} onOpenChange={setCreateUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstname"
                  value={newUser.firstname || ''}
                  onChange={(e) => handleChange('firstname', e.target.value)}
                  className={formErrors.firstname ? "border-red-500" : ""}
                />
                {formErrors.firstname && (
                  <p className="text-xs text-red-500">{formErrors.firstname}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastname"
                  value={newUser.lastname || ''}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  className={formErrors.lastname ? "border-red-500" : ""}
                />
                {formErrors.lastname && (
                  <p className="text-xs text-red-500">{formErrors.lastname}</p>
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
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role || 'member'}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
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
            <input type="hidden" name="plan" value={companyPlan} />
            <input type="hidden" name="is_active" value="true" />
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
