
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SiteConfig {
  id: string;
  under_construction: boolean;
  created_at: string;
  updated_at: string;
}

export function useSiteConfig() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchSiteConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site config:', error);
        return;
      }

      setSiteConfig(data);
    } catch (error) {
      console.error('Error fetching site config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUnderConstruction = async (underConstruction: boolean) => {
    if (!siteConfig) return false;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .update({ under_construction: underConstruction })
        .eq('id', siteConfig.id);

      if (error) {
        console.error('Error updating site config:', error);
        toast({
          title: "Error",
          description: "Failed to update construction mode",
          variant: "destructive",
        });
        return false;
      }

      setSiteConfig(prev => prev ? { ...prev, under_construction: underConstruction } : null);
      toast({
        title: "Success",
        description: `Construction mode ${underConstruction ? 'enabled' : 'disabled'}`,
      });
      return true;
    } catch (error) {
      console.error('Error updating site config:', error);
      toast({
        title: "Error",
        description: "Failed to update construction mode",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  return {
    siteConfig,
    loading,
    updating,
    updateUnderConstruction,
    refetch: fetchSiteConfig,
  };
}
