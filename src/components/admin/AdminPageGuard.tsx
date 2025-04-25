
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdminPageGuardProps {
  children: React.ReactNode;
}

export function AdminPageGuard({ children }: AdminPageGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
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
        console.log('AdminPageGuard: Checking session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('AdminPageGuard: No session found');
          setIsAuthenticated(false);
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        
        console.log('AdminPageGuard: Session found, user is authenticated');
        setIsAuthenticated(true);
        
        // Check if user has admin role
        const { data, error } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          role: 'admin'
        });
        
        console.log('AdminPageGuard: Admin role check result:', { data, error });
        
        if (error) {
          console.error('AdminPageGuard: Error checking admin role:', error);
          setIsAuthorized(false);
        } else {
          setIsAuthorized(!!data);
          
          if (!data) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin area.",
              variant: "destructive"
            });
          }
        }
      } catch (err) {
        console.error("AdminPageGuard: Error checking admin status:", err);
        setIsAuthenticated(false);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AdminPageGuard: Auth state changed:', event);
        if (!session) {
          setIsAuthenticated(false);
          setIsAuthorized(false);
        } else {
          setIsAuthenticated(true);
          // Recheck authorization when auth state changes
          checkAdminStatus();
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [toast]);

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
        console.log('AdminPageGuard: Login successful, checking admin role');
        // Check if user has admin role after login
        const { data: adminData, error: adminError } = await supabase.rpc('has_role', {
          user_id: data.user.id,
          role: 'admin'
        });
        
        console.log('AdminPageGuard: Admin role check after login:', { adminData, adminError });
        
        if (adminError || !adminData) {
          setError("You don't have permission to access the admin area.");
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive"
          });
        } else {
          setIsAuthenticated(true);
          setIsAuthorized(true);
          setError("");
        }
      }
    } catch (err: any) {
      console.error("AdminPageGuard: Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsAuthorized(false);
      navigate("/");
    } catch (err) {
      console.error("AdminPageGuard: Logout error:", err);
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

  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin area. Please contact an administrator if you believe this is an error.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/")} className="mr-4">Return to Home</Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
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
