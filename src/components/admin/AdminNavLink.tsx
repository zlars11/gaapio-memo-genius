
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

export function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('AdminNavLink: Checking session');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('AdminNavLink: No session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('AdminNavLink: Session found, checking admin role');
        const { data, error } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          role: 'admin'
        });

        console.log('AdminNavLink: Admin role check result:', { data, error });

        if (error) {
          console.error('AdminNavLink: Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('AdminNavLink: Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      console.log('AdminNavLink: Auth state changed, rechecking admin status');
      checkAdminStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin" aria-label="Admin Dashboard">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Admin Dashboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
