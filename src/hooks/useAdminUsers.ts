
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

export function useAdminUsers() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [currentUserDisplayed, setCurrentUserDisplayed] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [updatingName, setUpdatingName] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get the current user's session
  const getCurrentUserSession = async () => {
    try {
      console.log("Getting current user session");
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        return null;
      }
      
      if (session?.user) {
        console.log("Current user found:", session.user.email);
        setCurrentUserEmail(session.user.email);
        setCurrentUserId(session.user.id);
      } else {
        console.log("No current user session found");
      }
      
      return session;
    } catch (e) {
      console.error("Unexpected error in getCurrentUserSession:", e);
      return null;
    }
  };

  // Fetch admin users
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
      
      // Query user_roles table directly
      console.log("Fetching admin users from user_roles");
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, created_at, metadata')
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
      
      // Get user details from auth.users table
      console.log("Fetching user details from auth");
      const adminUsers: AdminUser[] = [];
      
      for (const roleEntry of roleData) {
        try {
          const userId = roleEntry.user_id;
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
          
          if (authError) {
            console.error(`Error fetching auth user ${userId}:`, authError);
            continue;
          }
          
          if (authUser?.user) {
            console.log(`Found auth user ${userId}:`, authUser.user.email);
            
            // Use metadata from user_roles if available, otherwise use empty values
            // Check if metadata is an object and has the required properties
            const metadata = typeof roleEntry.metadata === 'object' && roleEntry.metadata !== null 
              ? roleEntry.metadata 
              : {};
            
            adminUsers.push({
              id: userId,
              email: authUser.user.email || 'No email',
              first_name: metadata && 'first_name' in metadata ? metadata.first_name as string || null : null,
              last_name: metadata && 'last_name' in metadata ? metadata.last_name as string || null : null,
              created_at: roleEntry.created_at || authUser.user.created_at
            });
          }
        } catch (error) {
          console.error(`Error processing auth user ${roleEntry.user_id}:`, error);
        }
      }
      
      console.log(`Processed ${adminUsers.length} admin users:`, adminUsers);
      setAdmins(adminUsers);
      
      // FALLBACK: If current user should be admin but isn't in the list, add them manually
      if (currentUserIsAdmin && currentUserId && !adminUsers.some(admin => admin.id === currentUserId)) {
        console.log("Current user is admin but not in list, adding manually");
        
        if (session?.user) {
          const currentAdmin: AdminUser = {
            id: currentUserId,
            email: session.user.email || 'Current user',
            first_name: null,
            last_name: null,
            created_at: session.user.created_at || new Date().toISOString()
          };
          
          setAdmins(prev => [currentAdmin, ...prev]);
          setCurrentUserDisplayed(true);
        }
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

  // Handle removing an admin
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

  // Fix current user's admin status
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

      // Force add admin role for current user
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
          title: "Admin role exists in database",
          description: "Your admin role is already properly set in the database. Refreshing data to ensure you appear in the list."
        });
      } else {
        // Add admin role for current user
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: session.user.id, 
            role: 'admin',
            metadata: {} // Initialize with empty metadata
          });
        
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

  // Update current user's name
  const handleUpdateName = async (firstName: string, lastName: string) => {
    try {
      setUpdatingName(true);
      
      if (!currentUserId) {
        throw new Error("No user ID available");
      }
      
      console.log("Updating name for admin user:", currentUserId);
      console.log("New name values:", { firstName, lastName });
      
      // Find the specific user role entry
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('id, metadata')
        .eq('user_id', currentUserId)
        .eq('role', 'admin')
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking if admin role exists:", checkError);
        throw new Error("Failed to find your admin record");
      }
      
      if (!existingRole) {
        console.error("Admin role not found for user:", currentUserId);
        throw new Error("You don't appear to have an admin role assigned");
      }
      
      console.log("Existing role entry:", existingRole);
      
      // Ensure metadata is an object before updating
      const currentMetadata = typeof existingRole.metadata === 'object' && existingRole.metadata !== null 
        ? existingRole.metadata 
        : {};
      
      // Update metadata on the user_roles entry with name information
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({
          metadata: {
            ...currentMetadata,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          }
        })
        .eq('id', existingRole.id);
      
      if (updateError) {
        console.error("Error updating admin user name:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Name updated",
        description: "Your name has been updated successfully.",
      });
      
      // Update local state
      setAdmins(admins.map(admin => {
        if (admin.id === currentUserId) {
          return {
            ...admin,
            first_name: firstName,
            last_name: lastName
          };
        }
        return admin;
      }));
      
      setNameDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast({
        title: "Failed to update name",
        description: error.message || "An error occurred while trying to update your name.",
        variant: "destructive",
      });
    } finally {
      setUpdatingName(false);
    }
  };

  // Load admin users on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return {
    loading,
    admins,
    removing,
    currentUserIsAdmin,
    currentUserDisplayed,
    fetchError,
    currentUserEmail,
    currentUserId,
    updatingName,
    nameDialogOpen,
    setNameDialogOpen,
    handleRemoveAdmin,
    handleFixCurrentUserAdmin,
    handleUpdateName,
    fetchAdmins,
  };
}
