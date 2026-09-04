-- Stride security hardening migration
-- Run this migration against the existing Supabase database.
--
-- This migration targets the schema currently used by the live database:
-- categories(id, user_id, name, created_at, updated_at)
-- items(id, user_id, category_id, title, unit_label, current_step,
--       total_steps, status, created_at, updated_at)
--
-- It is intentionally idempotent so it can be safely re-run.

-- 1. Make the (category id, owner id) pair uniquely referenceable.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'categories_id_user_id_unique'
      and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories
      add constraint categories_id_user_id_unique unique (id, user_id);
  end if;
end
$$;

-- 2. Enforce that an item's category belongs to the same user as the item.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'items_category_user_fk'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_category_user_fk
      foreign key (category_id, user_id)
      references public.categories (id, user_id)
      on delete cascade;
  end if;
end
$$;

-- 3. Add practical length limits to fields that actually exist in the live DB.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'categories_name_length_check'
      and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories
      add constraint categories_name_length_check
      check (char_length(name) between 1 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'items_title_length_check'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_title_length_check
      check (char_length(title) between 1 and 200);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'items_unit_label_length_check'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_unit_label_length_check
      check (char_length(unit_label) between 1 and 50);
  end if;
end
$$;

-- 4. Ensure RLS remains enabled.
alter table public.categories enable row level security;
alter table public.items enable row level security;
