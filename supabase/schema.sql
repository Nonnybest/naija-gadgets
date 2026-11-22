-- Tables are prefixed ng_ so they never clash with your other sites sharing this database.
create extension if not exists "pgcrypto";

create table if not exists ng_products(
  id uuid primary key default gen_random_uuid(),
  name text not null, category text not null,
  price integer not null check(price>=0), -- naira
  stock integer not null default 0 check(stock>=0),
  image_url text, description text, featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists ng_orders(
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  reference text unique not null, name text, email text, phone text,
  address text, zone text, shipping integer, total integer,
  items jsonb, status text default 'paid', created_at timestamptz default now()
);

alter table ng_products enable row level security;
alter table ng_orders enable row level security;

-- Admin policies
drop policy if exists "public read" on ng_products;
create policy "public read" on ng_products for select using (true);

drop policy if exists "admin write" on ng_products;
create policy "admin write" on ng_products for all
  using (auth.jwt()->>'email'='ajalijohn102@gmail.com') with check (auth.jwt()->>'email'='ajalijohn102@gmail.com');

drop policy if exists "admin read orders" on ng_orders;
create policy "admin read orders" on ng_orders for select using (auth.jwt()->>'email'='ajalijohn102@gmail.com');

drop policy if exists "admin update orders" on ng_orders;
create policy "admin update orders" on ng_orders for update using (auth.jwt()->>'email'='ajalijohn102@gmail.com');

drop policy if exists users_read_own_orders on ng_orders;
create policy users_read_own_orders on ng_orders for select using (auth.uid() = user_id);
