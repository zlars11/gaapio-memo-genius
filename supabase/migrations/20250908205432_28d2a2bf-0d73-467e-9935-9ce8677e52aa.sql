-- Remove the public select policy that allows anyone to read waitlist submissions
DROP POLICY IF EXISTS "Allow all select" ON public.waitlist_submissions;

-- Add a new policy that only allows admin users to view waitlist submissions
CREATE POLICY "Only admins can view waitlist submissions" 
ON public.waitlist_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));