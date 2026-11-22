create extension if not exists "pgcrypto";

create table if not exists ng_agent_tasks(
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  prompt text not null,
  output text,
  model text,
  status text default 'draft',
  created_at timestamptz default now()
);

alter table ng_agent_tasks enable row level security;

drop policy if exists "admin all tasks" on ng_agent_tasks;
create policy "admin all tasks" on ng_agent_tasks for all
  using (auth.jwt()->>'email'='ajalijohn102@gmail.com')
  with check (auth.jwt()->>'email'='ajalijohn102@gmail.com');
