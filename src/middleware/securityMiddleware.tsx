
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SecurityMiddlewareProps {
  children: React.ReactNode;
}

// List of paths that require authentication
const protectedPaths = ['/admin'];

/**
 * Security middleware component that enforces authentication for protected routes
 */
export function SecurityMiddleware({ children }: SecurityMiddlewareProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    // Check if current path requires authentication
    const requiresAuth = protectedPaths.some(path => 
      location.pathname.startsWith(path)
    );
    
    if (requiresAuth) {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setIsLoading(false);
        
        if (!session) {
          navigate(`/`, { replace: true });
        }
      };
      
      checkAuth();
      
      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setIsAuthenticated(!!session);
          
          if (!session && requiresAuth) {
            navigate(`/`, { replace: true });
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

export default SecurityMiddleware;
