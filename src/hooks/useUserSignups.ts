
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserSignup } from "@/components/admin/types/userTypes";

export function useUserSignups() {
  const [users, setUsers] = useState<UserSignup[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSignup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_signups")
        .select("*")
        .order("signupdate", { ascending: false });
      
      if (error) {
        setUsers([]);
        setFilteredUsers([]);
      } else {
        setUsers(data as UserSignup[]);
        setFilteredUsers(data as UserSignup[]);
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
        (user: UserSignup) =>
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
      .from("user_signups")
      .select("*")
      .order("signupdate", { ascending: false });
    
    if (!error && data) {
      setUsers(data as UserSignup[]);
      setFilteredUsers(data as UserSignup[]);
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
