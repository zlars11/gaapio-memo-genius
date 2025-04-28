
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DemoRequestFormData } from "../types/demoRequestTypes";

export function useDemoRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<DemoRequestFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("demo_requests")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
        });

      if (error) throw error;

      toast({
        title: "Demo request submitted",
        description: "Thank you for your interest! We'll be in touch soon.",
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
