-- Re-enable RLS on site_settings after table recreation in 0006_site_settings.sql.
-- 0002_policies enabled RLS, but DROP/CREATE in 0006 left the new table without it.
-- 0009 recreated the admin policy but did not turn RLS back on.

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());
