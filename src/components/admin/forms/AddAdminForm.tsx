
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminFormValues } from "@/types/adminTypes";

// Create a form schema for adding an admin
const addAdminFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

interface AddAdminFormProps {
  onSubmit: (values: AdminFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  defaultValues?: {
    email: string; // Note: This is required now
    firstName?: string;
    lastName?: string;
  };
}

export function AddAdminForm({ onSubmit, onCancel, isLoading, defaultValues }: AddAdminFormProps) {
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(addAdminFormSchema),
    defaultValues: {
      email: defaultValues?.email || "",
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
    },
  });

  // Reset form when defaultValues change
  React.useEffect(() => {
    if (defaultValues && !form.formState.isDirty) {
      form.setValue("email", defaultValues.email || "");
      form.setValue("firstName", defaultValues.firstName || "");
      form.setValue("lastName", defaultValues.lastName || "");
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                  disabled={isLoading}
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
                  value={field.value || ""}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
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
  );
}
