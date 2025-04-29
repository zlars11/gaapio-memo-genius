
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  // Directly get the current user's session
  const getCurrentUserSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return session;
  };

  // More efficient admin users fetch
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      console.log("Fetching admin users - started");
      
      // Get current user's session first
      const session = await getCurrentUserSession();
      const currentUserId = session?.user?.id;
      
      if (currentUserId) {
        console.log("Current user ID:", currentUserId);
        
        // Check if user has admin role using the RPC function
        const { data: isAdmin, error: roleCheckError } = await supabase.rpc('has_role', {
          user_id: currentUserId,
          role: 'admin'
        });
        
        if (roleCheckError) {
          console.error("Error checking admin status:", roleCheckError);
          setFetchError("Failed to verify your admin status");
        } else {
          console.log("Current user admin check result:", isAdmin);
          setCurrentUserIsAdmin(!!isAdmin);
        }
      } else {
        console.log("No current user session found");
      }
      
      // Use a simpler query approach - first get all admin role user IDs
      console.log("Fetching user_roles records for 'admin' role");
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (roleError) {
        console.error("Error fetching admin roles:", roleError);
        setFetchError("Failed to fetch admin roles");
        setAdmins([]);
        setLoading(false);
        return;
      }
      
      console.log(`Found ${roleData?.length || 0} admin role records:`, roleData);
      
      if (!roleData || roleData.length === 0) {
        console.log("No admin users found");
        setAdmins([]);
        setCurrentUserDisplayed(false);
        setLoading(false);
        return;
      }
      
      // Extract user IDs from the role data
      const adminUserIds = roleData.map(role => role.user_id);
      console.log("Admin user IDs:", adminUserIds);
      
      // Check if current user is in admin list
      if (currentUserId) {
        const isCurrentUserInList = adminUserIds.includes(currentUserId);
        console.log("Is current user in admin list:", isCurrentUserInList);
        setCurrentUserDisplayed(isCurrentUserInList);
      }
      
      // Then fetch user details for those IDs using 'in' filter
      console.log("Fetching user details for admin users");
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, created_at')
        .in('id', adminUserIds);
      
      if (userError) {
        console.error("Error fetching admin user details:", userError);
        setFetchError("Failed to fetch admin user details");
        setAdmins([]);
        setLoading(false);
        return;
      }
      
      console.log(`Found ${userData?.length || 0} admin user records:`, userData);
      
      // Convert to AdminUser array and set state
      if (userData) {
        setAdmins(userData as AdminUser[]);
      } else {
        setAdmins([]);
      }
      
      console.log("Admin users fetch completed");
    } catch (error) {
      console.error("Unexpected error in fetchAdmins:", error);
      setFetchError("An unexpected error occurred while fetching admin users");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new admin user - more efficient version
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
      
      // Check if user exists by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newAdminEmail)
        .maybeSingle();
      
      if (userError) {
        console.error("Error checking user existence:", userError);
        throw new Error("Failed to check if user exists");
      }
      
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
      
      if (roleCheckError) {
        console.error("Error checking existing role:", roleCheckError);
        throw new Error("Failed to check existing admin role");
      }
      
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
      
      if (insertError) {
        console.error("Error adding admin role:", insertError);
        throw new Error("Failed to grant admin privileges");
      }
      
      toast({
        title: "Admin added",
        description: `${newAdminEmail} has been granted admin access.`,
      });
      
      setNewAdminEmail("");
      setAddDialogOpen(false);
      fetchAdmins(); // Refresh the list
      
    } catch (error: any) {
      console.error("Error in handleAddAdmin:", error);
      toast({
        title: "Failed to add admin",
        description: error.message || "An error occurred while trying to add the admin user.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  // Remove admin role - more efficient version
  const handleRemoveAdmin = async (adminId: string) => {
    try {
      setRemoving(adminId);
      
      // Delete the user_role entry directly
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', adminId)
        .eq('role', 'admin');
      
      if (error) {
        console.error("Error removing admin role:", error);
        throw error;
      }
      
      toast({
        title: "Admin removed",
        description: "Admin privileges have been revoked from this user.",
      });
      
      // Refresh admin list
      fetchAdmins();
      
    } catch (error: any) {
      console.error("Error in handleRemoveAdmin:", error);
      toast({
        title: "Failed to remove admin",
        description: error.message || "An error occurred while trying to remove admin privileges.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  // Fix current user's admin status - more efficient version
  const handleFixCurrentUserAdmin = async () => {
    try {
      const session = await getCurrentUserSession();
      if (!session?.user) {
        toast({
          title: "Not authenticated",
          description: "You need to be logged in to perform this action.",
          variant: "destructive",
        });
        return;
      }

      console.log("Fixing admin status for user:", session.user.id);

      // Check if the user_roles entry already exists
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing role:", checkError);
        throw new Error("Failed to check your current admin status");
      }

      if (existingRole) {
        console.log("Admin role entry already exists:", existingRole);
        toast({
          title: "Admin role already exists",
          description: "Your admin role is already in the database, refreshing data..."
        });
      } else {
        // Add admin role for current user
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: session.user.id, role: 'admin' });
        
        if (insertError) {
          console.error("Error adding admin role:", insertError);
          throw new Error("Failed to add you to the admin users list");
        }
        
        toast({
          title: "Admin role fixed",
          description: "You've been properly added to the admin users list.",
        });
      }
      
      // Always refresh after attempting the fix
      fetchAdmins();
      
    } catch (error: any) {
      console.error("Error fixing admin status:", error);
      toast({
        title: "Failed to fix admin status",
        description: error.message || "An error occurred while trying to update your admin status.",
        variant: "destructive",
      });
    }
  };

  // Load admin users on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

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
        
        {fetchError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Admin Users</AlertTitle>
            <AlertDescription>
              {fetchError}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4" 
                onClick={fetchAdmins}
              >
                Try Again
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
