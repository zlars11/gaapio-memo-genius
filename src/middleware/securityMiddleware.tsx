
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
    
    if (requiresAuth) {
      const checkAuth = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            console.log('No session found, redirecting to login');
            setIsLoading(false);
            navigate('/login', { replace: true });
            return;
          }

          // Check if user has admin role using the has_role RPC function
          const { data, error } = await supabase.rpc('has_role', {
            user_id: session.user.id,
            role: 'admin'
          });

          if (error) {
            console.error('Role check error:', error);
            throw new Error('Authorization check failed');
          }
          
          // If not admin, throw error
          if (!data) {
            throw new Error('Unauthorized access');
          }

          setIsAuthorized(true);
          setIsLoading(false);
        } catch (error: any) {
          console.error('Auth error:', error);
          toast({
            title: "Access Denied",
            description: error.message || "You don't have permission to access this area",
            variant: "destructive"
          });
          
          // Redirect to login if not authenticated, home if authenticated but not authorized
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            navigate('/login', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
          setIsLoading(false);
        }
      };
      
      checkAuth();
      
      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!session) {
            setIsAuthorized(false);
            if (requiresAuth) {
              navigate('/login', { replace: true });
            }
          } else {
            // Recheck admin status on auth changes
            try {
              const { data } = await supabase.rpc('has_role', {
                user_id: session.user.id,
                role: 'admin'
              });
              
              setIsAuthorized(!!data);
              
              if (!data && protectedPaths.some(path => location.pathname.startsWith(path))) {
                navigate('/', { replace: true });
              }
            } catch (error) {
              console.error('Auth change error:', error);
              setIsAuthorized(false);
              if (requiresAuth) {
                navigate('/', { replace: true });
              }
            }
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
      setIsAuthorized(true);
    }
  }, [navigate, location.pathname, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export default SecurityMiddleware;
