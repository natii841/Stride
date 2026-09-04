-- Stride security hardening migration
-- Run this migration against the existing Supabase database.

-- 1. Make the (category id, owner id) pair uniquely referenceable.
alter table public.categories
  add constraint categories_id_user_id_unique unique (id, user_id);

-- 2. Enforce that an item's category belongs to the same user as the item.
-- The existing category_id foreign key can remain; this additional composite
-- foreign key enforces the ownership relationship.
alter table public.items
  add constraint items_category_user_fk
  foreign key (category_id, user_id)
  references public.categories (id, user_id)
  on delete cascade;

-- 3. Add practical length/format limits at the database boundary.
alter table public.categories
  add constraint categories_name_length_check
    check (char_length(name) between 1 and 100),
  add constraint categories_icon_length_check
    check (char_length(icon) between 1 and 50),
  add constraint categories_color_format_check
    check (color ~ '^#[0-9A-Fa-f]{6}$'),
  add constraint categories_description_length_check
    check (description is null or char_length(description) <= 1000);

alter table public.items
  add constraint items_title_length_check
    check (char_length(title) between 1 and 200),
  add constraint items_unit_length_check
    check (char_length(unit) between 1 and 50),
  add constraint items_notes_length_check
    check (notes is null or char_length(notes) <= 5000);

-- 4. Ensure RLS remains enabled.
alter table public.categories enable row level security;
alter table public.items enable row level security;
