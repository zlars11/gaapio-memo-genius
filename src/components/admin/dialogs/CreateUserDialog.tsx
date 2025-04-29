
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Create schema for the create user form that requires a password
const createUserFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: {
    email: string;
    firstName: string;
    lastName: string;
  };
  isLoading: boolean;
  onSubmit: (values: CreateUserFormValues) => Promise<void>;
}

export function CreateUserDialog({ 
  open, 
  onOpenChange, 
  defaultValues, 
  isLoading, 
  onSubmit 
}: CreateUserDialogProps) {
  
  // Form with zod validation
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: defaultValues.email || "",
      firstName: defaultValues.firstName || "",
      lastName: defaultValues.lastName || "",
      password: "",
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New User</AlertDialogTitle>
              <AlertDialogDescription>
                No user with email {form.getValues().email} was found. Create this user and make them an admin?
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="py-4 space-y-4">
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Password" 
                        type="password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading} type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  // Prevent default to let the form submission handle it
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
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
  );
}
