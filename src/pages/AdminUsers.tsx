
import { useState, useEffect } from "react";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  // Fetch admin users
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      
      // Get all users with admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          created_at
        `)
        .eq('role', 'admin');
      
      if (roleError) throw roleError;
      
      // No admin users found
      if (!roleData || roleData.length === 0) {
        setAdmins([]);
        return;
      }
      
      // Get user details for each admin
      const adminDetails: AdminUser[] = [];
      
      for (const role of roleData) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, created_at')
          .eq('id', role.user_id)
          .single();
        
        if (!userError && userData) {
          adminDetails.push(userData as AdminUser);
        }
      }
      
      setAdmins(adminDetails);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        title: "Error loading admin users",
        description: "Failed to load the list of admin users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new admin user
  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAdding(true);
      
      // First, check if user exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newAdminEmail)
        .maybeSingle();
      
      if (userError) throw userError;
      
      if (!userData) {
        toast({
          title: "User not found",
          description: "No user with this email exists in the system. They need to sign up first.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if user is already an admin
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userData.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (roleCheckError) throw roleCheckError;
      
      if (existingRole) {
        toast({
          title: "Already an admin",
          description: "This user already has admin privileges.",
          variant: "destructive",
        });
        return;
      }
      
      // Add admin role to user
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userData.id, role: 'admin' });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Admin added",
        description: `${newAdminEmail} has been granted admin access.`,
      });
      
      setNewAdminEmail("");
      setAddDialogOpen(false);
      fetchAdmins(); // Refresh the list
      
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Failed to add admin",
        description: "An error occurred while trying to add the admin user.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  // Remove admin role from a user
  const handleRemoveAdmin = async (adminId: string) => {
    try {
      setRemoving(adminId);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', adminId)
        .eq('role', 'admin');
      
      if (error) throw error;
      
      toast({
        title: "Admin removed",
        description: "Admin privileges have been revoked from this user.",
      });
      
      fetchAdmins(); // Refresh the list
      
    } catch (error) {
      console.error("Error removing admin:", error);
      toast({
        title: "Failed to remove admin",
        description: "An error occurred while trying to remove admin privileges.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  // Load admin users on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <AdminPageGuard>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin User Management</h1>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage users with access to the admin portal
              </CardDescription>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </CardHeader>
          <CardContent>
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
                    <TableRow key={admin.id}>
                      <TableCell>
                        {admin.first_name || admin.last_name 
                          ? `${admin.first_name || ''} ${admin.last_name || ''}`.trim() 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleRemoveAdmin(admin.id)}
                          disabled={removing === admin.id}
                        >
                          {removing === admin.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <UserX className="h-4 w-4 mr-1" />
                          )}
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
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
          </CardContent>
        </Card>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">
              Enter the email of a user who should receive admin privileges.
              The user must already have an account in the system.
            </p>
            <Input 
              placeholder="user@example.com" 
              value={newAdminEmail} 
              onChange={(e) => setNewAdminEmail(e.target.value)}
              disabled={adding}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAddDialogOpen(false)}
              disabled={adding}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddAdmin}
              disabled={adding}
            >
              {adding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Admin'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageGuard>
  );
}
