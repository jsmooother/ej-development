-- Update Enquiries policy to allow both admins and editors to view
DROP POLICY IF EXISTS "Admins view enquiries" ON public.enquiries;

CREATE POLICY "Editors view enquiries" ON public.enquiries
  FOR SELECT USING (public.is_admin_or_editor());

