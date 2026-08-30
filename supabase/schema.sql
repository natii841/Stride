-- =========================================================
-- STRIDE - Supabase PostgreSQL Schema & Row Level Security (RLS)
-- Step 2: Custom Categories and Dynamic Tracking Items Schema
-- =========================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null check (char_length(name) >= 1),
    icon text default 'Layers',
    color text default '#E1306C',
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ITEMS TABLE (Dynamic Tracking Parameters)
create table if not exists public.items (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete cascade not null,
    title text not null check (char_length(title) >= 1),
    current_value numeric default 0 not null check (current_value >= 0),
    target_value numeric not null check (target_value > 0),
    unit text not null check (char_length(unit) >= 1),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. INDEXES FOR HIGH-PERFORMANCE QUERIES
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_categories_created_at on public.categories(created_at desc);

create index if not exists idx_items_user_id on public.items(user_id);
create index if not exists idx_items_category_id on public.items(category_id);
create index if not exists idx_items_created_at on public.items(created_at desc);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.categories enable row level security;
alter table public.items enable row level security;

-- 5. RLS POLICIES FOR CATEGORIES (Users only access their own records)

-- Policy: Select only user's own categories
create policy "Users can view their own categories"
    on public.categories
    for select
    using (auth.uid() = user_id);

-- Policy: Insert only for current authenticated user
create policy "Users can insert their own categories"
    on public.categories
    for insert
    with check (auth.uid() = user_id);

-- Policy: Update only user's own categories
create policy "Users can update their own categories"
    on public.categories
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy: Delete only user's own categories
create policy "Users can delete their own categories"
    on public.categories
    for delete
    using (auth.uid() = user_id);

-- 6. RLS POLICIES FOR ITEMS (Users only access their own records)

-- Policy: Select only user's own items
create policy "Users can view their own items"
    on public.items
    for select
    using (auth.uid() = user_id);

-- Policy: Insert only for current authenticated user
create policy "Users can insert their own items"
    on public.items
    for insert
    with check (auth.uid() = user_id);

-- Policy: Update only user's own items
create policy "Users can update their own items"
    on public.items
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy: Delete only user's own items
create policy "Users can delete their own items"
    on public.items
    for delete
    using (auth.uid() = user_id);

-- 7. TRIGGER FOR AUTO UPDATING 'updated_at' TIMESTAMP
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
