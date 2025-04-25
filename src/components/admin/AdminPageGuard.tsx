
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AdminPageGuardProps {
  children: React.ReactNode;
}

export function AdminPageGuard({ children }: AdminPageGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in and has admin role
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if user has admin role in metadata
          // This would ideally query a user_roles table in your database
          const { data, error } = await supabase
            .from('user_signups')
            .select('*')
            .eq('email', session.user.email)
            .eq('status', 'active')
            .single();
            
          if (data && data.plan === 'enterprise') {
            setIsAuthenticated(true);
          } else {
            // Not an admin, redirect
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin area.",
              variant: "destructive"
            });
            navigate("/");
          }
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogin = async () => {
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Check if user has admin role after login
        const { data: userData, error: userError } = await supabase
          .from('user_signups')
          .select('*')
          .eq('email', data.user.email)
          .eq('status', 'active')
          .single();
        
        if (userError || !userData || userData.plan !== 'enterprise') {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive"
          });
          setError("You don't have permission to access the admin area.");
        } else {
          setIsAuthenticated(true);
          setError("");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying access...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please sign in with your admin credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                type="email" 
                placeholder="Enter admin email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Input 
                type="password" 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
      {children}
    </div>
  );
}
