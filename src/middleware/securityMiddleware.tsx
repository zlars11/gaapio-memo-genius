
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface SecurityMiddlewareProps {
  children: React.ReactNode;
}

const protectedPaths = ['/admin'];

export function SecurityMiddleware({ children }: SecurityMiddlewareProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const requiresAuth = protectedPaths.some(path => 
      location.pathname.startsWith(path)
    );
    
    if (!requiresAuth) {
      // If not on a protected path, don't check auth
      setIsLoading(false);
      setIsAuthorized(true);
      return;
    }
    
    const checkAuth = async () => {
      try {
        console.log('SecurityMiddleware: Checking authentication...');
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (!session) {
          console.log('SecurityMiddleware: No session found, redirecting to login');
          setIsLoading(false);
          setIsAuthorized(false);
          
          toast({
            title: "Authentication Required",
            description: "Please login to access this area",
            variant: "default"
          });
          
          navigate('/login', { state: { from: location.pathname } });
          return;
        }

        console.log('SecurityMiddleware: Session found, user ID:', session.user.id);
        
        // User is authenticated, let AdminPageGuard handle admin permission check
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error: any) {
        console.error('SecurityMiddleware: Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive"
        });
        
        navigate('/login', { state: { from: location.pathname } });
        setIsLoading(false);
        setIsAuthorized(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('SecurityMiddleware: Auth state changed:', event);
        
        if (!session && requiresAuth) {
          console.log('SecurityMiddleware: No session after auth change');
          setIsAuthorized(false);
          navigate('/login', { state: { from: location.pathname } });
        } else if (session && requiresAuth) {
          console.log('SecurityMiddleware: Session found after auth change');
          setIsAuthorized(true);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized && protectedPaths.some(path => location.pathname.startsWith(path))) {
    return null; // Return null as the navigation will happen
  }

  return <>{children}</>;
}

export default SecurityMiddleware;
