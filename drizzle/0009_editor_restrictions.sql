-- Create admin-only helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
  );
$$;

-- Drop and recreate policies with proper restrictions

-- Site Settings: Admin only
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- Enquiries: Admin can view, public can submit
DROP POLICY IF EXISTS "Editors view enquiries" ON public.enquiries;
CREATE POLICY "Admins view enquiries" ON public.enquiries
  FOR SELECT USING (public.is_admin());

-- Instagram Cache: Admin only for writes
DROP POLICY IF EXISTS "Editors refresh instagram cache" ON public.instagram_cache;
CREATE POLICY "Admins refresh instagram cache" ON public.instagram_cache
  FOR ALL USING (public.is_admin());

-- Instagram Settings: Admin only
DROP POLICY IF EXISTS "Editors view instagram settings" ON public.instagram_settings;
DROP POLICY IF EXISTS "Editors manage instagram settings" ON public.instagram_settings;

CREATE POLICY "Admins view instagram settings" ON public.instagram_settings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins manage instagram settings" ON public.instagram_settings
  FOR ALL USING (public.is_admin());

-- Profiles: Admin only
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Projects, Editorials (posts), Listings remain accessible to both admins and editors
-- These policies are already correct:
-- - "Editors manage projects" USING is_admin_or_editor()
-- - "Editors manage posts" USING is_admin_or_editor()
-- - "Editors manage listings" USING is_admin_or_editor()

