
import React, { useEffect } from 'react';
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(false);
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
            throw new Error('Authentication required');
          }

          // Check if user has admin role
          const { data, error } = await supabase
            .rpc('has_role', {
              user_id: session.user.id,
              role: 'admin'
            });

          if (error) throw error;
          
          // If not admin, throw error
          if (!data) {
            throw new Error('Unauthorized access');
          }

          setIsAuthorized(true);
        } catch (error: any) {
          console.error('Auth error:', error);
          toast({
            title: "Access Denied",
            description: error.message || "You don't have permission to access this area",
            variant: "destructive"
          });
          navigate('/', { replace: true });
        } finally {
          setIsLoading(false);
        }
      };
      
      checkAuth();
      
      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!session) {
            setIsAuthorized(false);
            navigate('/', { replace: true });
          } else {
            // Recheck admin status on auth changes
            const { data } = await supabase.rpc('has_role', {
              user_id: session.user.id,
              role: 'admin'
            });
            setIsAuthorized(!!data);
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
