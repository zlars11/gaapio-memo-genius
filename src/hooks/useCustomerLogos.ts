import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CustomerLogo {
  id: string;
  company_name: string;
  logo_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerLogoInsert {
  company_name: string;
  logo_url: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CustomerLogoUpdate {
  company_name?: string;
  logo_url?: string;
  display_order?: number;
  is_active?: boolean;
}

// Fetch all customer logos (admin view)
export function useCustomerLogos() {
  return useQuery({
    queryKey: ["customer-logos-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_logos")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching customer logos:", error);
        throw error;
      }
      return data as CustomerLogo[];
    },
    retry: 1,
    retryDelay: 1000,
    throwOnError: false,
  });
}

// Fetch only active customer logos (public view)
export function useActiveCustomerLogos() {
  return useQuery({
    queryKey: ["customer-logos-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_logos")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as CustomerLogo[];
    },
  });
}

// Upload customer logo to storage and create DB record
export function useUploadCustomerLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      companyName,
      displayOrder = 0,
      isActive = true,
    }: {
      file: File;
      companyName: string;
      displayOrder?: number;
      isActive?: boolean;
    }) => {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("customer-logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("customer-logos")
        .getPublicUrl(filePath);

      // Insert into database
      const { data, error: dbError } = await supabase
        .from("customer_logos")
        .insert({
          company_name: companyName,
          logo_url: publicUrl,
          display_order: displayOrder,
          is_active: isActive,
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return data as CustomerLogo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-logos-admin"] });
      queryClient.invalidateQueries({ queryKey: ["customer-logos-active"] });
      toast.success("Customer logo uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload logo: ${error.message}`);
    },
  });
}

// Update customer logo
export function useUpdateCustomerLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: CustomerLogoUpdate;
    }) => {
      const { data, error } = await supabase
        .from("customer_logos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as CustomerLogo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-logos-admin"] });
      queryClient.invalidateQueries({ queryKey: ["customer-logos-active"] });
      toast.success("Customer logo updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update logo: ${error.message}`);
    },
  });
}

// Delete customer logo (removes from storage and DB)
export function useDeleteCustomerLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: CustomerLogo) => {
      // Extract file path from URL
      const urlParts = logo.logo_url.split("/");
      const filePath = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("customer-logos")
        .remove([filePath]);

      if (storageError) console.error("Storage deletion error:", storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from("customer_logos")
        .delete()
        .eq("id", logo.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-logos-admin"] });
      queryClient.invalidateQueries({ queryKey: ["customer-logos-active"] });
      toast.success("Customer logo deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete logo: ${error.message}`);
    },
  });
}
