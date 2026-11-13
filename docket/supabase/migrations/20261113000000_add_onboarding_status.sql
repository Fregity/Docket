
-- Existing accounts should not be shown the new-user wizard.
alter table public.profiles
add column if not exists onboarding_completed boolean
not null default true;

-- New accounts start with onboarding incomplete.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    onboarding_completed
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
