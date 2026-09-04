-- =========================================================
-- STRIDE - Supabase PostgreSQL Schema & Row Level Security (RLS)
-- Security-hardened schema
-- =========================================================

create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null check (char_length(name) between 1 and 100),
    icon text default 'Layers' check (char_length(icon) between 1 and 50),
    color text default '#E1306C' check (color ~ '^#[0-9A-Fa-f]{6}$'),
    description text check (description is null or char_length(description) <= 1000),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Allows the items table to enforce that category_id and user_id belong together.
    constraint categories_id_user_id_unique unique (id, user_id)
);

-- 2. ITEMS TABLE
create table if not exists public.items (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete cascade not null,
    title text not null check (char_length(title) between 1 and 200),
    current_value numeric default 0 not null check (current_value >= 0),
    target_value numeric not null check (target_value > 0),
    unit text not null check (char_length(unit) between 1 and 50),
    notes text check (notes is null or char_length(notes) <= 5000),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Critical authorization invariant: an item can only reference a category
    -- owned by the same user as the item.
    constraint items_category_user_fk
      foreign key (category_id, user_id)
      references public.categories (id, user_id)
      on delete cascade
);

-- 3. INDEXES
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_categories_created_at on public.categories(created_at desc);
create index if not exists idx_items_user_id on public.items(user_id);
create index if not exists idx_items_category_id on public.items(category_id);
create index if not exists idx_items_created_at on public.items(created_at desc);

-- 4. ENABLE ROW LEVEL SECURITY
alter table public.categories enable row level security;
alter table public.items enable row level security;

-- 5. RLS POLICIES FOR CATEGORIES
create policy "Users can view their own categories"
    on public.categories for select
    using (auth.uid() = user_id);

create policy "Users can insert their own categories"
    on public.categories for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own categories"
    on public.categories for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
    on public.categories for delete
    using (auth.uid() = user_id);

-- 6. RLS POLICIES FOR ITEMS
create policy "Users can view their own items"
    on public.items for select
    using (auth.uid() = user_id);

create policy "Users can insert their own items"
    on public.items for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own items"
    on public.items for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own items"
    on public.items for delete
    using (auth.uid() = user_id);

-- 7. AUTO-UPDATE updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create or replace trigger set_categories_updated_at
    before update on public.categories
    for each row
    execute procedure public.handle_updated_at();

create or replace trigger set_items_updated_at
    before update on public.items
    for each row
    execute procedure public.handle_updated_at();
