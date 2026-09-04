-- Stride security hardening migration
-- Run this migration against the existing Supabase database.
--
-- This migration is intentionally idempotent where PostgreSQL allows it:
-- running it again will not recreate constraints that already exist.

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

-- 3. Add practical length/format limits at the database boundary.
-- The DO blocks make these safe to re-run without duplicate-constraint errors.
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
    where conname = 'categories_icon_length_check'
      and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories
      add constraint categories_icon_length_check
      check (char_length(icon) between 1 and 50);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'categories_color_format_check'
      and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories
      add constraint categories_color_format_check
      check (color ~ '^#[0-9A-Fa-f]{6}$');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'categories_description_length_check'
      and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories
      add constraint categories_description_length_check
      check (description is null or char_length(description) <= 1000);
  end if;
end
$$;

do $$
begin
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
    where conname = 'items_unit_length_check'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_unit_length_check
      check (char_length(unit) between 1 and 50);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'items_notes_length_check'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_notes_length_check
      check (notes is null or char_length(notes) <= 5000);
  end if;
end
$$;

-- 4. Ensure RLS remains enabled.
alter table public.categories enable row level security;
alter table public.items enable row level security;
