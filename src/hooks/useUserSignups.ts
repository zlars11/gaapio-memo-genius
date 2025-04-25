import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/components/admin/types/userTypes";

export function useUserSignups() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("signupdate", { ascending: false });
      
      if (error) {
        setUsers([]);
        setFilteredUsers([]);
      } else {
        setUsers(data as User[]);
        setFilteredUsers(data as User[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user: User) =>
          (user.firstname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.lastname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.plan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.company || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const refreshUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("signupdate", { ascending: false });
    
    if (!error && data) {
      setUsers(data as User[]);
      setFilteredUsers(data as User[]);
    }
  };

  return {
    users,
    filteredUsers,
    loading,
    searchQuery,
    setSearchQuery,
    refreshUsers,
  };
}
