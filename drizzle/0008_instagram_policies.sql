-- Enable RLS for instagram_settings table
ALTER TABLE public.instagram_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins/editors can read instagram settings
CREATE POLICY "Editors view instagram settings" ON public.instagram_settings
  FOR SELECT USING (public.is_admin_or_editor());

-- Policy: Only admins/editors can manage instagram settings
CREATE POLICY "Editors manage instagram settings" ON public.instagram_settings
  FOR ALL USING (public.is_admin_or_editor());

