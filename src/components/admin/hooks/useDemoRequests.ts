
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DemoRequest, DemoRequestRow } from "../types/demoRequestTypes";

export function useDemoRequests() {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDemoRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch demo requests",
        variant: "destructive",
      });
      setRequests([]);
      setFilteredRequests([]);
    } else {
      const mappedData = (data as DemoRequestRow[]).map(row => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        notes: row.notes || "",
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
      
      setRequests(mappedData);
      setFilteredRequests(mappedData);
    }
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(
        (request) =>
          request.firstName.toLowerCase().includes(query.toLowerCase()) ||
          request.lastName.toLowerCase().includes(query.toLowerCase()) ||
          request.email.toLowerCase().includes(query.toLowerCase()) ||
          request.notes.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  };

  return {
    requests: filteredRequests,
    loading,
    fetchDemoRequests,
    handleSearch
  };
}
