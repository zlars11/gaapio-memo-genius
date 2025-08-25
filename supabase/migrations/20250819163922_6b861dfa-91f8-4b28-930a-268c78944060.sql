-- Fix security vulnerability: Restrict contact_submissions access to admin users only

-- Drop the dangerous "Allow all select" policy that exposes personal data
DROP POLICY IF EXISTS "Allow all select" ON public.contact_submissions;

-- Create admin-only SELECT policy for contact submissions
CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create admin-only UPDATE policy for contact submissions (if needed for admin management)
CREATE POLICY "Only admins can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create admin-only DELETE policy for contact submissions (if needed for admin management)
CREATE POLICY "Only admins can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role);

-- Keep the existing INSERT policy so contact forms still work for everyone
-- "Allow all insert" policy remains unchanged