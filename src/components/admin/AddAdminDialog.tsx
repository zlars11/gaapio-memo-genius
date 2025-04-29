
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addAdminRole } from "@/utils/adminRoleUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

// Create a form schema for adding an admin
const addAdminFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Create a separate schema for the create user form that requires a password
const createUserFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AddAdminFormValues = z.infer<typeof addAdminFormSchema>;
type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export function AddAdminDialog({ open, onOpenChange, onSuccess }: AddAdminDialogProps) {
  const [adding, setAdding] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const { toast } = useToast();

  // Main form for adding admin
  const form = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  // Separate form for creating user
  const createUserForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  // Reset forms when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      createUserForm.reset();
    }
    onOpenChange(open);
  };

  const createUserAccount = async (values: CreateUserFormValues) => {
    try {
      setAdding(true);
      
      // Instead of using auth.admin API which might require higher privileges,
      // try using signUp API first which can be called with anon key
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName
          }
        }
      });
      
      if (signUpError) {
        console.error("Error creating user with signUp:", signUpError);
        
        // Fall back to admin.createUser if available
        try {
          const { data, error } = await supabase.auth.admin.createUser({
            email: values.email,
            password: values.password,
            email_confirm: true,
            user_metadata: {
              first_name: values.firstName,
              last_name: values.lastName
            }
          });
          
          if (error) {
            console.error("Error creating user with admin API:", error);
            toast({
              title: "Failed to create user",
              description: error.message || "User not allowed. You may need to create the user in the Supabase dashboard.",
              variant: "destructive",
            });
            return;
          }
          
          if (!data.user) {
            toast({
              title: "Failed to create user",
              description: "User creation returned no data.",
              variant: "destructive",
            });
            return;
          }
          
          // Add admin role to the newly created user with name data
          const success = await addAdminRole(data.user.id, values.firstName, values.lastName);
          
          if (!success) {
            toast({
              title: "User created but admin role not added",
              description: "The user account was created but we couldn't assign admin privileges.",
              variant: "destructive",
            });
            return;
          }
          
          toast({
            title: "Admin user created",
            description: `${values.email} has been created and granted admin access.`,
          });
          
        } catch (adminError) {
          console.error("Error in admin user creation:", adminError);
          toast({
            title: "Failed to create user",
            description: "You might need to create this user in the Supabase dashboard first.",
            variant: "destructive",
          });
          return;
        }
      } else if (signUpData && signUpData.user) {
        // User created successfully via signUp
        console.log("User created via signUp:", signUpData.user);
        
        // Add admin role to the newly created user
        const success = await addAdminRole(signUpData.user.id, values.firstName, values.lastName);
        
        if (!success) {
          toast({
            title: "User created but admin role not added",
            description: "The user account was created but we couldn't assign admin privileges.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Admin user created",
          description: `${values.email} has been created and granted admin access.`,
        });
      }
      
      setCreateUserDialogOpen(false);
      form.reset();
      onOpenChange(false);
      onSuccess(); // Refresh the list
      
    } catch (error: any) {
      console.error("Error in createUserAccount:", error);
      toast({
        title: "Failed to create admin user",
        description: error.message || "An error occurred while creating the admin user.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleAddAdmin = async (values: AddAdminFormValues) => {
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
          .ilike('email', values.email)
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
            // Try to find user using the available methods
            const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
            
            if (authError) {
              console.error("Error checking user in auth:", authError);
              // Try alternative method - using signUp with existing email should fail with user exists error
              const { error } = await supabase.auth.signUp({
                email: values.email,
                password: 'temporaryPassword123', // This won't be used if user exists
              });
              
              if (error && error.message.includes('already registered')) {
                // User exists, let's try to get their ID a different way
                console.log("User exists based on signup attempt");
                
                // One final attempt - fetch all users and filter manually
                const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
                
                if (!fetchError && users) {
                  const matchingUser = users.find(
                    (user: SupabaseAuthUser) => user.email && user.email.toLowerCase() === values.email.toLowerCase()
                  );
                  
                  if (matchingUser) {
                    userId = matchingUser.id;
                    console.log("Found user ID through direct fetch:", userId);
                  }
                }
              }
            } else if (authUsers && authUsers.users) {
              const matchingUser = authUsers.users.find(
                (user: SupabaseAuthUser) => user.email && user.email.toLowerCase() === values.email.toLowerCase()
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
        // User doesn't exist - prepare create user form with firstName and lastName already filled in
        createUserForm.reset({
          email: values.email,
          firstName: values.firstName || "",
          lastName: values.lastName || "",
          password: "",
        });
        
        setCreateUserDialogOpen(true);
        setAdding(false);
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
      
      // Add admin role to user with name metadata - ensure first and last name are passed
      const success = await addAdminRole(
        userId, 
        values.firstName || "Admin", // Provide default if missing
        values.lastName || "User"    // Provide default if missing
      );
      
      if (!success) {
        throw new Error("Failed to grant admin privileges");
      }
      
      toast({
        title: "Admin added",
        description: `${values.email} has been granted admin access.`,
      });
      
      form.reset();
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
  React.useEffect(() => {
    if (open && !form.formState.isDirty) {
      if (window.location.pathname.includes("/admin")) {
        form.setValue("email", "jacewchambers@gmail.com");
        form.setValue("firstName", "Jace");
        form.setValue("lastName", "Chambers");
      }
    }
  }, [open, form]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddAdmin)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Email (e.g., user@example.com)" 
                        {...field}
                        disabled={adding}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First Name" 
                        {...field}
                        value={field.value || ""}
                        disabled={adding}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Last Name" 
                        {...field}
                        value={field.value || ""}
                        disabled={adding}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    form.reset();
                    onOpenChange(false);
                  }}
                  disabled={adding}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
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
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={createUserDialogOpen} onOpenChange={setCreateUserDialogOpen}>
        <AlertDialogContent>
          <Form {...createUserForm}>
            <form onSubmit={createUserForm.handleSubmit(createUserAccount)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New User</AlertDialogTitle>
                <AlertDialogDescription>
                  No user with email {createUserForm.getValues().email} was found. Create this user and make them an admin?
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="py-4 space-y-4">
                <FormField
                  control={createUserForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="First Name" 
                          {...field}
                          disabled={adding}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createUserForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Last Name" 
                          {...field}
                          disabled={adding}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createUserForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Password" 
                          type="password"
                          {...field}
                          disabled={adding}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel disabled={adding} type="button">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    // Prevent default to let the form submission handle it
                    e.preventDefault();
                    createUserForm.handleSubmit(createUserAccount)();
                  }}
                  disabled={adding}
                >
                  {adding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create User & Add as Admin'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
