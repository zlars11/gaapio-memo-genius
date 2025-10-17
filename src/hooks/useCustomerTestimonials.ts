import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CustomerTestimonial {
  id: string;
  quote: string;
  avatar_url: string | null;
  customer_name: string;
  customer_title: string;
  highlight_words: string[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTestimonialInput {
  quote: string;
  avatar_url?: string;
  customer_name: string;
  customer_title: string;
  highlight_words?: string[];
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateTestimonialInput extends CreateTestimonialInput {
  id: string;
}

// Fetch all testimonials (admin view)
export function useCustomerTestimonials() {
  return useQuery({
    queryKey: ["customer-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_testimonials")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as CustomerTestimonial[];
    },
    throwOnError: false,
  });
}

// Fetch only active testimonials (public view)
export function useActiveTestimonials() {
  return useQuery({
    queryKey: ["customer-testimonials", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_testimonials")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as CustomerTestimonial[];
    },
  });
}

// Upload avatar image
export async function uploadTestimonialAvatar(
  file: File,
  testimonialId: string
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${testimonialId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("customer-testimonials")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("customer-testimonials").getPublicUrl(filePath);

  return publicUrl;
}

// Delete avatar image
export async function deleteTestimonialAvatar(avatarUrl: string) {
  if (!avatarUrl || !avatarUrl.includes("customer-testimonials")) return;

  const path = avatarUrl.split("/customer-testimonials/")[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from("customer-testimonials")
    .remove([path]);

  if (error) console.error("Error deleting avatar:", error);
}

// Create testimonial mutation
export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTestimonialInput) => {
      const { data, error } = await supabase
        .from("customer_testimonials")
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update testimonial mutation
export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateTestimonialInput) => {
      const { data, error } = await supabase
        .from("customer_testimonials")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Delete testimonial mutation
export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("customer_testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
