
import { useState, useEffect } from "react";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, UserX, RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [currentUserDisplayed, setCurrentUserDisplayed] = useState(false);
  const { toast } = useToast();

  // Comprehensive fetch for admin users - ensures all users with admin privileges are displayed
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      console.log("Fetching admin users...");
      
      // Get the current user to check if they're in the results
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (currentUserId) {
        // Check if current user has admin role using the same RPC function used by security
        const { data: isAdmin, error: roleCheckError } = await supabase.rpc('has_role', {
          user_id: currentUserId,
          role: 'admin'
        });
        
        console.log("Current user admin status:", { isAdmin, error: roleCheckError });
        setCurrentUserIsAdmin(!!isAdmin);
      }
      
      // Get all entries from user_roles for admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (roleError) {
        console.error("Error fetching admin roles:", roleError);
        throw roleError;
      }
      
      console.log("Admin roles retrieved:", roleData);
      
      if (!roleData || roleData.length === 0) {
        console.log("No admin users found in user_roles table");
        setAdmins([]);
        setCurrentUserDisplayed(false);
        return;
      }
      
      // Extract user IDs from role data
      const adminUserIds = roleData.map(role => role.user_id);
      
      // Check if current user is in the admin list
      if (currentUserId) {
        setCurrentUserDisplayed(adminUserIds.includes(currentUserId));
      }
      
      // Then fetch user details for those IDs
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, created_at')
        .in('id', adminUserIds);
      
      if (userError) {
        console.error("Error fetching admin users:", userError);
        throw userError;
      }
      
      console.log("User data retrieved:", userData);
      
      // Check for any discrepancy in data
      if (userData && adminUserIds.length !== userData.length) {
        console.warn("Discrepancy detected: Some admin users don't have corresponding user entries", {
          roleIds: adminUserIds,
          userIds: userData.map(u => u.id)
        });
      }
      
      setAdmins(userData || []);
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

  // Handle the case where current user has admin access but isn't in the list
  const handleFixCurrentUserAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Not authenticated",
          description: "You need to be logged in to perform this action.",
          variant: "destructive",
        });
        return;
      }

      // Get the current user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', session.user.id)
        .single();
      
      if (userError || !userData) {
        console.error("Error fetching current user:", userError);
        toast({
          title: "User lookup failed",
          description: "Could not find your user details in the system.",
          variant: "destructive",
        });
        return;
      }

      // Add admin role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: session.user.id, role: 'admin' });
      
      if (insertError) {
        // Check if it's a unique constraint violation (user already has admin role)
        if (insertError.code === '23505') {
          toast({
            title: "Already an admin",
            description: "Your user is already in the admin role table. Refreshing data..."
          });
        } else {
          throw insertError;
        }
      } else {
        toast({
          title: "Admin role fixed",
          description: "You've been properly added to the admin users list.",
        });
      }
      
      // Refresh the list
      fetchAdmins();
      
    } catch (error) {
      console.error("Error fixing admin status:", error);
      toast({
        title: "Failed to fix admin status",
        description: "An error occurred while trying to update your admin status.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminPageGuard>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin User Management</h1>
        
        {currentUserIsAdmin && !currentUserDisplayed && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Issue Detected</AlertTitle>
            <AlertDescription>
              You have admin access but aren't listed in the admin users table. This is a security risk.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4" 
                onClick={handleFixCurrentUserAdmin}
              >
                Fix My Admin Status
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage users with access to the admin portal
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchAdmins} title="Refresh admin list">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setAddDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
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
