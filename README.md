# ⚡ Stride — Next-Gen Habit & Step Tracker

**Stride** is a web application inspired by Instagram's visual feed structure, designed for tracking habits, steps, reading lists, and daily milestones. Built with React/Vite, Tailwind CSS, and Supabase, Stride provides real-time data persistence, dynamic metric calculations, and secure user isolation.

---

## ✨ Features

* **Instagram-Inspired UI:** Dark-mode visual feed layout with custom glassmorphism components.
* **Custom Category Lists:** Create tailored categories (e.g., *Books*, *Daily Steps*, *Hydration*) with targeted milestones.
* **Dynamic Analytics:** Real-time completion rates, active unit counters, efficiency scores, and daily streak tracking.
* **Supabase Authentication:** Email/password verification and Google OAuth integration.
* **Secure Storage:** Private media bucket architecture for book covers, progress photos, and profile avatars.
* **Responsive Layout:** Mobile-first user interface with desktop dashboard layouts.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS
* **Backend & Database:** Supabase (PostgreSQL, Row Level Security)
* **Authentication:** Supabase Auth + Google Cloud OAuth 2.0
* **Storage:** Supabase Private Storage Buckets
* **Hosting:** Vercel

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed:

* Node.js (v18+)
* npm or pnpm
* A [Supabase](https://supabase.com) account

### 2. Clone & Install

```bash
git clone https://github.com/your-username/stride.git
cd stride
npm install

```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

```

### 4. Database Setup (Supabase SQL)

Run the following schema inside your Supabase SQL Editor to initialize tables and enable Row Level Security (RLS):

```sql
-- 1. Create Categories Table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text check (type in ('tracker', 'habit', 'counter')) default 'tracker',
  created_at timestamp with time zone default now()
);

-- 2. Create Items Table
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  title text not null,
  current_value numeric default 0,
  target_value numeric default 0,
  unit text,
  updated_at timestamp with time zone default now()
);

-- 3. Enable RLS
alter table public.categories enable row level security;
alter table public.items enable row level security;

-- 4. RLS Policies
create policy "Users manage own categories" on public.categories 
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage own items" on public.items 
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

```

### 5. Run Locally

```bash
npm run dev

```

Open `http://localhost:5173` to launch the application.

---

## 🔒 Security Architecture

* **Database Isolation:** All tables enforce Postgres Row Level Security (RLS) checked against `auth.uid()`.
* **Storage Rules:** Uploaded cover media in `stride-media` is scoped directly to authenticated user paths (`stride-media/{user_id}/`).
* **Client Key Scoping:** Frontend relies exclusively on the public `VITE_SUPABASE_ANON_KEY`.

---

## 🌐 Deployment

To deploy to Vercel:

1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Environment Variables section.
3. Update your live deployment URL in **Supabase Dashboard** $\rightarrow$ **Authentication** $\rightarrow$ **URL Configuration** and **Google Cloud Console** $\rightarrow$ **Authorized JavaScript Origins**.

---
