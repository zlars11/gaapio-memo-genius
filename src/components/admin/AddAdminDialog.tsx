
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addAdminRole } from "@/utils/adminRoleUtils";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Define an interface for the user structure we get from Supabase auth
interface SupabaseAuthUser {
  id: string;
  email?: string | null;
}

export function AddAdminDialog({ open, onOpenChange, onSuccess }: AddAdminDialogProps) {
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const resetForm = () => {
    setNewAdminEmail("");
    setFirstName("");
    setLastName("");
  };

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
      
      // First check if user exists in auth
      let userId: string | null = null;
      
      // Check if user exists by email in auth
      try {
        // Check in users table first (easier for most implementations)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .ilike('email', newAdminEmail)
          .maybeSingle();
        
        if (userError) {
          console.error("Error checking user existence:", userError);
        } else if (userData) {
          userId = userData.id;
          console.log("Found user in users table:", userId);
        }
        
        // If not found in users table, try auth.admin API
        if (!userId) {
          try {
            const { data: usersData, error: authError } = await supabase.auth.admin.listUsers();
            
            if (authError) {
              console.error("Error checking user in auth:", authError);
            } else if (usersData) {
              const matchingUser = usersData.users.find(
                (user: SupabaseAuthUser) => user.email && user.email.toLowerCase() === newAdminEmail.toLowerCase()
              );
              
              if (matchingUser) {
                userId = matchingUser.id;
                console.log("Found user in auth:", userId);
              }
            }
          } catch (authListError) {
            console.error("Auth admin API error:", authListError);
            // Continue flow - we'll check if userId was found by other means
          }
        }
      } catch (checkError) {
        console.error("Error during user existence check:", checkError);
        // Continue with the flow - we'll handle not finding the user below
      }
      
      if (!userId) {
        toast({
          title: "User not found",
          description: "No user with this email exists in the system. They need to sign up first.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if user is already an admin
      try {
        const { data: existingRole, error: roleCheckError } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
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
      } catch (roleError) {
        console.error("Role check error:", roleError);
        // Continue flow - we'll try to add the role anyway
      }
      
      // Add admin role to user with name metadata
      const success = await addAdminRole(userId, firstName, lastName);
      
      if (!success) {
        throw new Error("Failed to grant admin privileges");
      }
      
      toast({
        title: "Admin added",
        description: `${newAdminEmail} has been granted admin access.`,
      });
      
      resetForm();
      onOpenChange(false);
      onSuccess(); // Refresh the list
      
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

  // Populate default values if the dialog is for adding Jace
  const populateJace = () => {
    if (open && newAdminEmail === "" && firstName === "" && lastName === "") {
      if (window.location.pathname === "/admin/users") {
        setNewAdminEmail("jacewchambers@gmail.com");
        setFirstName("Jace");
        setLastName("Chambers");
      }
    }
  };
  
  // Call populateJace when dialog opens
  if (open) {
    populateJace();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm mb-2">
            Enter the email of a user who should receive admin privileges.
            The user must already have an account in the system.
          </p>
          <Input 
            placeholder="Email (e.g., user@example.com)" 
            value={newAdminEmail} 
            onChange={(e) => setNewAdminEmail(e.target.value)}
            disabled={adding}
          />
          <Input 
            placeholder="First Name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            disabled={adding}
          />
          <Input 
            placeholder="Last Name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            disabled={adding}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
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
  );
}
