create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.role in ('admin', 'editor')
  );
$$;

alter table public.site_settings enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.listing_documents enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.posts enable row level security;
alter table public.enquiries enable row level security;
alter table public.instagram_cache enable row level security;
alter table public.profiles enable row level security;

-- Site settings
create policy "Public read site settings" on public.site_settings
  for select using (true);

create policy "Admins manage site settings" on public.site_settings
  for all using (public.is_admin_or_editor());

-- Listings
create policy "Public read published listings" on public.listings
  for select using (is_published = true);

create policy "Editors manage listings" on public.listings
  for all using (public.is_admin_or_editor());

create policy "Public read listing media" on public.listing_images
  for select using (
    exists (
      select 1 from public.listings
      where listings.id = listing_images.listing_id
        and listings.is_published = true
    )
  );

create policy "Editors manage listing media" on public.listing_images
  for all using (public.is_admin_or_editor());

create policy "Public read listing documents" on public.listing_documents
  for select using (
    exists (
      select 1 from public.listings
      where listings.id = listing_documents.listing_id
        and listings.is_published = true
    )
  );

create policy "Editors manage listing documents" on public.listing_documents
  for all using (public.is_admin_or_editor());

-- Projects
create policy "Public read published projects" on public.projects
  for select using (is_published = true);

create policy "Editors manage projects" on public.projects
  for all using (public.is_admin_or_editor());

create policy "Public read project media" on public.project_images
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = project_images.project_id
        and projects.is_published = true
    )
  );

create policy "Editors manage project media" on public.project_images
  for all using (public.is_admin_or_editor());

-- Posts
create policy "Public read published posts" on public.posts
  for select using (is_published = true);

create policy "Editors manage posts" on public.posts
  for all using (public.is_admin_or_editor());

-- Enquiries
create policy "Public submit enquiries" on public.enquiries
  for insert with check (true);

create policy "Editors view enquiries" on public.enquiries
  for select using (public.is_admin_or_editor());

-- Instagram cache
create policy "Public read instagram cache" on public.instagram_cache
  for select using (true);

create policy "Editors refresh instagram cache" on public.instagram_cache
  for all using (public.is_admin_or_editor());

-- Profiles (managed only by admins)
create policy "Admins manage profiles" on public.profiles
  for all using (public.is_admin_or_editor());
