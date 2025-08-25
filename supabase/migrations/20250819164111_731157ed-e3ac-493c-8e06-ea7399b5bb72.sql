-- Fix security vulnerability: Restrict demo_requests access to admin users only

-- Drop the overly permissive policy that allows any authenticated user to view demo requests
DROP POLICY IF EXISTS "Only authenticated users can view demo requests" ON public.demo_requests;

-- The existing "Allow admins to view all demo requests" policy already provides proper admin-only access
-- Keep all other existing policies unchanged:
-- - "Allow admins to delete all demo requests" (admin only - good)
-- - "Allow admins to update all demo requests" (admin only - good) 
-- - "Allow admins to view all demo requests" (admin only - good)
-- - "Allow anonymous insertions to demo_requests" (for contact forms - good)
-- - "Allow authenticated insertions to demo_requests" (for contact forms - good)
-- - "Anyone can create demo requests" (for contact forms - good)