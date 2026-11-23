-- Naija Gadgets: run once on the VPS database (see DEPLOY.md, step 1).
-- Safe to run twice.

-- 1) Photos: several per product
alter table public.ng_products add column if not exists images text[] not null default '{}';

-- 2) Admins live in a table instead of being hard-coded in every rule
create table if not exists public.ng_admins (email text primary key);
alter table public.ng_admins enable row level security;
insert into public.ng_admins (email) values ('ajalijohn102@gmail.com') on conflict do nothing;  -- CHANGE if your admin email is different

create or replace function public.ng_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.ng_admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

drop policy if exists "admin all tasks" on public.ng_agent_tasks;
drop policy if exists "admin read orders" on public.ng_orders;
drop policy if exists "admin update orders" on public.ng_orders;
drop policy if exists "admin write" on public.ng_products;
create policy "admin all tasks" on public.ng_agent_tasks using (public.ng_is_admin()) with check (public.ng_is_admin());
create policy "admin read orders" on public.ng_orders for select using (public.ng_is_admin());
create policy "admin update orders" on public.ng_orders for update using (public.ng_is_admin());
create policy "admin write" on public.ng_products using (public.ng_is_admin()) with check (public.ng_is_admin());

-- 3) Visitors who are not signed in can only read products
revoke all on public.ng_orders from anon;
revoke all on public.ng_agent_tasks from anon;
revoke all on public.ng_products from anon;
grant select on public.ng_products to anon;

-- 4) Photo storage bucket (admin uploads from the dashboard)
insert into storage.buckets (id, name, public) values ('ng-products', 'ng-products', true) on conflict (id) do nothing;
drop policy if exists "ng images read" on storage.objects;
drop policy if exists "ng images admin write" on storage.objects;
create policy "ng images read" on storage.objects for select using (bucket_id = 'ng-products');
create policy "ng images admin write" on storage.objects for all
  using (bucket_id = 'ng-products' and public.ng_is_admin())
  with check (bucket_id = 'ng-products' and public.ng_is_admin());

-- 5) Remove the 500 generated products and start with the verified ones
delete from public.ng_products;

-- PLACEHOLDER prices and stock: change them in the admin dashboard.
insert into public.ng_products (name, category, price, stock, featured, description, image_url, images) values
('Raspberry Pi 5', 'Raspberry Pi & Single Board Computers', 150000, 5, true,
 'Raspberry Pi 5 single-board computer with a quad-core 64-bit Arm Cortex-A76 processor at 2.4GHz, dual 4K display output and a PCIe 2.0 interface for fast storage. Confirm the RAM size you stock and add it to the name.',
 'https://assets.raspberrypi.com/static/c671804c05a51efc4e3c2a1bdcbafbcf/e58b5/raspberry-pi-5.png',
 array['https://assets.raspberrypi.com/static/c671804c05a51efc4e3c2a1bdcbafbcf/e58b5/raspberry-pi-5.png',
       'https://assets.raspberrypi.com/static/30b0a05490a436a282259a767caba3fb/6ebc2/rp1.png',
       'https://assets.raspberrypi.com/static/8f6eca535dbb23a21eb41a748050e3a0/b0461/16gb.png']),
('TP-Link Tapo C200 Pan/Tilt Wi-Fi Security Camera', 'Smart Security & Surveillance', 35000, 5, true,
 'Pan and tilt Wi-Fi home security camera with 1080p video, night vision, two-way audio, motion detection and microSD card recording. Works with the Tapo app on your phone.',
 'https://static.tp-link.com/upload/image-line/01_large_20230817224004v.jpg',
 array['https://static.tp-link.com/upload/image-line/01_large_20230817224004v.jpg',
       'https://static.tp-link.com/upload/image-line/03_large_20230817224214y.jpg',
       'https://static.tp-link.com/upload/image-line/05_large_20230817224635v.jpg']);
