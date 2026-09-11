-- Docket database schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query)

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- Tables
-- ============================================================

-- One row per authenticated user. Mirrors auth.users, kept in sync by a trigger.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  period text,
  teacher text,
  invite_code text not null unique,
  accent_color text not null default 'olive',
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (class_id, user_id)
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  title text not null,
  description text,
  due_date date not null,
  completed boolean not null default false,
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_class_members_user on class_members (user_id);
create index if not exists idx_class_members_class on class_members (class_id);
create index if not exists idx_assignments_class on assignments (class_id);
create index if not exists idx_assignments_due_date on assignments (due_date);

-- ============================================================
-- Keep profiles in sync with auth.users
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles enable row level security;
alter table classes enable row level security;
alter table class_members enable row level security;
alter table assignments enable row level security;

-- profiles: anyone signed in can read display names (needed for "Added by"
-- and member lists); a user can only ever update their own row.
create policy "profiles are readable by any signed-in user"
  on profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid());

-- classes: only visible to members of that class. Rows are created through
-- the create_class() function below rather than a raw insert.
create policy "members can view their classes"
  on classes for select
  to authenticated
  using (
    exists (
      select 1 from class_members cm
      where cm.class_id = classes.id and cm.user_id = auth.uid()
    )
  );

-- class_members: a user can see the membership rows for any class they
-- themselves belong to (this is what powers the "Members" list).
create policy "members can view fellow members of their classes"
  on class_members for select
  to authenticated
  using (
    class_id in (
      select class_id from class_members where user_id = auth.uid()
    )
  );

-- assignments: only visible / writable by members of the parent class.
create policy "members can view assignments"
  on assignments for select
  to authenticated
  using (
    exists (
      select 1 from class_members cm
      where cm.class_id = assignments.class_id and cm.user_id = auth.uid()
    )
  );

create policy "members can add assignments"
  on assignments for insert
  to authenticated
  with check (
    exists (
      select 1 from class_members cm
      where cm.class_id = assignments.class_id and cm.user_id = auth.uid()
    )
  );

create policy "members can edit assignments"
  on assignments for update
  to authenticated
  using (
    exists (
      select 1 from class_members cm
      where cm.class_id = assignments.class_id and cm.user_id = auth.uid()
    )
  );

create policy "members can delete assignments"
  on assignments for delete
  to authenticated
  using (
    exists (
      select 1 from class_members cm
      where cm.class_id = assignments.class_id and cm.user_id = auth.uid()
    )
  );

-- ============================================================
-- RPC functions (security definer) for class creation / joining.
-- Using functions instead of raw inserts keeps invite-code generation and
-- "add creator as first member" atomic, and lets join-by-code work without
-- opening up class_members to arbitrary inserts.
-- ============================================================

create or replace function generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no 0/O/1/I ambiguity
  code text;
  exists_already boolean;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    end loop;
    select exists(select 1 from classes where invite_code = code) into exists_already;
    exit when not exists_already;
  end loop;
  return code;
end;
$$;

create or replace function create_class(
  p_name text,
  p_period text,
  p_teacher text,
  p_accent_color text
)
returns classes
language plpgsql
security definer set search_path = public
as $$
declare
  new_class classes;
begin
  insert into classes (name, period, teacher, accent_color, invite_code, created_by)
  values (p_name, nullif(p_period, ''), nullif(p_teacher, ''), p_accent_color, generate_invite_code(), auth.uid())
  returning * into new_class;

  insert into class_members (class_id, user_id) values (new_class.id, auth.uid());

  return new_class;
end;
$$;

create or replace function join_class_by_code(p_code text)
returns classes
language plpgsql
security definer set search_path = public
as $$
declare
  target classes;
begin
  select * into target from classes where invite_code = upper(p_code);

  if target.id is null then
    raise exception 'invalid_invite_code';
  end if;

  insert into class_members (class_id, user_id)
  values (target.id, auth.uid())
  on conflict (class_id, user_id) do nothing;

  return target;
end;
$$;

-- Lets a signed-in but not-yet-a-member user preview a class from an invite
-- link (name + member count) without exposing full class/assignment data.
create or replace function preview_class_by_code(p_code text)
returns table (id uuid, name text, period text, member_count bigint)
language sql
security definer set search_path = public
as $$
  select c.id, c.name, c.period, count(cm.id)
  from classes c
  left join class_members cm on cm.class_id = c.id
  where c.invite_code = upper(p_code)
  group by c.id, c.name, c.period;
$$;

-- preview_class_by_code must be callable by signed-out visitors opening an
-- invite link, before they've authenticated.
grant execute on function preview_class_by_code(text) to anon, authenticated;
grant execute on function join_class_by_code(text) to authenticated;
grant execute on function create_class(text, text, text, text) to authenticated;

-- ============================================================
-- Admin count helper — used by the internal /admin page.
-- Returns simple totals only, no personal data.
-- ============================================================
create or replace function admin_counts()
returns table (total_users bigint, total_classes bigint, total_assignments bigint)
language sql
security definer set search_path = public
as $$
  select
    (select count(*) from profiles),
    (select count(*) from classes),
    (select count(*) from assignments);
$$;

grant execute on function admin_counts() to authenticated;
