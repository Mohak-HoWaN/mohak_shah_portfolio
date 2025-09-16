-- Fix critical security issue: Remove overly permissive profile viewing policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create more secure policy: Only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Keep existing policies for insert/update (they're already secure)
-- Users can still insert and update their own profiles securely