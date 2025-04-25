
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
          console.log('SecurityMiddleware: Checking authentication...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            console.log('SecurityMiddleware: No session found, redirecting to login');
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/login', { replace: true });
            return;
          }

          console.log('SecurityMiddleware: Session found, user ID:', session.user.id);
          console.log('SecurityMiddleware: Checking admin role with parameters:', {
            user_id: session.user.id,
            role: 'admin'
          });
          
          // Check if user has admin role using the has_role RPC function
          const { data, error } = await supabase.rpc('has_role', {
            user_id: session.user.id,
            role: 'admin'
          });

          console.log('SecurityMiddleware: Admin role check result:', { data, error });

          if (error) {
            console.error('SecurityMiddleware: Role check error:', error);
            throw new Error('Authorization check failed');
          }
          
          // If not admin, throw error
          if (!data) {
            console.log('SecurityMiddleware: User is not an admin');
            throw new Error('Unauthorized access');
          }

          console.log('SecurityMiddleware: User is authorized as admin');
          setIsAuthorized(true);
          setIsLoading(false);
        } catch (error: any) {
          console.error('SecurityMiddleware: Auth error:', error);
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
          setIsAuthorized(false);
        }
      };
      
      checkAuth();
      
      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('SecurityMiddleware: Auth state changed:', event);
          if (!session) {
            setIsAuthorized(false);
            if (requiresAuth) {
              navigate('/login', { replace: true });
            }
          } else {
            // Recheck admin status on auth changes
            const recheckAdmin = async () => {
              try {
                console.log('SecurityMiddleware: Rechecking admin status on auth change');
                const { data, error } = await supabase.rpc('has_role', {
                  user_id: session.user.id,
                  role: 'admin'
                });
                
                console.log('SecurityMiddleware: Admin role recheck result:', { data, error });
                
                if (error) {
                  throw error;
                }
                
                setIsAuthorized(!!data);
                
                if (!data && protectedPaths.some(path => location.pathname.startsWith(path))) {
                  navigate('/', { replace: true });
                }
              } catch (error) {
                console.error('SecurityMiddleware: Auth change error:', error);
                setIsAuthorized(false);
                if (requiresAuth) {
                  navigate('/', { replace: true });
                }
              }
            };
            
            // Use setTimeout to avoid potential auth deadlocks
            setTimeout(recheckAdmin, 0);
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
        <div className="animate-pulse">Loading Security Check...</div>
      </div>
    );
  }

  if (!isAuthorized && protectedPaths.some(path => location.pathname.startsWith(path))) {
    return null; // Return null as the navigation will happen
  }

  return <>{children}</>;
}

export default SecurityMiddleware;
