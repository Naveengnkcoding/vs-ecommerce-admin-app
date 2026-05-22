# Quick Start - Vellore Santhai Admin Dashboard

Get up and running in 5 minutes!

## What You're Getting

A fully functional admin dashboard with:
- ✅ Product management (edit prices, images, stock status)
- ✅ Customer management (view, edit, delete customers)
- ✅ Blog & news system (create agricultural & e-commerce news)
- ✅ Simple admin login (no complex authentication)
- ✅ Dashboard with real-time stats
- ✅ Responsive design (mobile-friendly)

## Installation (2 steps)

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Add Supabase Credentials

**Option A: Using v0 Settings (Easiest)**
1. Click the ⚙️ Settings button (top right)
2. Go to the **Vars** tab
3. Add these two environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase Anon Key

Get these from: [Supabase Dashboard](https://app.supabase.com) → Settings → API

**Option B: Using .env.local File**
Create a file named `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Setup Database (3 steps)

### Step 1: Create Supabase Account
Go to [supabase.com](https://supabase.com) and create a new project

### Step 2: Copy the SQL Queries
Open Supabase Dashboard → SQL Editor

Copy and paste these 3 queries (one at a time):

**Query 1: Products Table**
```sql
CREATE TABLE IF NOT EXISTS public.products (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en       text          NOT NULL,
  name_ta       text          NOT NULL,
  price         numeric(10,2) NOT NULL,
  weight        text          NOT NULL,
  category      text          NOT NULL,
  image_url     text          DEFAULT '',
  in_stock      boolean       DEFAULT true,
  sort_order    int           DEFAULT 0,
  created_at    timestamptz   DEFAULT now(),
  updated_at    timestamptz   DEFAULT now()
);
```

**Query 2: Customers Table**
```sql
CREATE TABLE IF NOT EXISTS public.customers (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text          NOT NULL,
  mobile        text          NOT NULL,
  address       text          NOT NULL,
  created_at    timestamptz   DEFAULT now(),
  updated_at    timestamptz   DEFAULT now()
);
```

**Query 3: Blog News Table**
```sql
CREATE TABLE IF NOT EXISTS public.blog_news (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text          NOT NULL,
  content       text          NOT NULL,
  category      text          NOT NULL,
  image_url     text          DEFAULT '',
  published     boolean       DEFAULT false,
  created_at    timestamptz   DEFAULT now(),
  updated_at    timestamptz   DEFAULT now()
);
```

### Step 3: Run the Queries
Click the "Run" button for each query. Tables should be created successfully.

## Run the App

```bash
pnpm dev
```

Visit: **http://localhost:3000/login**

## Login

```
Username: admin
Password: admin@0000
```

## What to Do Next

### 1. Add Sample Data (Optional)

In Supabase SQL Editor, add sample products:

```sql
INSERT INTO public.products (name_en, name_ta, price, weight, category, in_stock)
VALUES 
  ('Tomato', 'தக்காளி', 50, '1 kg', 'veg-fruits', true),
  ('Spinach', 'பாளக்கீரை', 30, '500 g', 'greens', true),
  ('Milk', 'பால்', 60, '1 litre', 'milk-dairy', true);
```

### 2. Explore Features

- **Products**: Filter by category, edit prices, toggle stock status
- **Customers**: Add customers manually in Supabase, edit/delete from admin
- **Blog**: Create posts, categorize as agriculture or e-commerce news
- **Dashboard**: View real-time stats

### 3. Add Your Images

When adding products or blog posts, use image URLs:
```
https://example.com/image.jpg
```

## Features Overview

### 📦 Products Management
- View all products with images
- Filter by: Vegetables, Greens, Dairy, Meat
- Edit price inline
- Update image URL
- Toggle stock status
- Delete products

### 👥 Customers Management
- View customer list
- Expand for full details
- Edit: Name, Mobile, Address
- Delete customers
- See join date

### 📝 Blog & News
- Create posts
- Categories: Agriculture News, E-commerce News
- Add featured images
- Publish/Draft toggle
- Edit anytime
- Delete posts

### 📊 Dashboard
- Real-time customer count
- Total products count
- Blog posts count
- Quick navigation

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "supabaseUrl is required" error | Make sure you added the env vars and restarted the server |
| Dashboard shows 0 customers | Create the tables first, then add data |
| Images not loading | Use full URLs starting with `https://` |
| Login fails | Use credentials: admin / admin@0000 |
| Tables don't exist | Run all 3 SQL queries in Supabase SQL Editor |

## Customization

### Change Admin Password
Edit `/lib/user.js`:
```javascript
const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'your-new-password'
```

### Add More Categories
Edit `/app/dashboard/products/page.tsx` and `/app/dashboard/blog/page.tsx`, find `CATEGORIES` array

### Styling
- Colors: `/app/globals.css` and `/tailwind.config.ts`
- Components: `/components/ui/`
- Layout: Each page file (e.g., `/app/dashboard/products/page.tsx`)

## Files You Created

| File | Purpose |
|------|---------|
| app/login/page.tsx | Login page |
| app/dashboard/layout.tsx | Dashboard sidebar layout |
| app/dashboard/page.tsx | Dashboard overview |
| app/dashboard/products/page.tsx | Product management |
| app/dashboard/customers/page.tsx | Customer management |
| app/dashboard/blog/page.tsx | Blog & news |
| lib/supabase.ts | Supabase client |
| lib/user.js | Auth utilities |
| hooks/useProducts.ts | Products data fetching |
| hooks/useCustomers.ts | Customers data fetching |
| hooks/useBlog.ts | Blog data fetching |

## Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Supabase (PostgreSQL)
- Tailwind CSS
- shadcn/ui Components

## Next Steps

1. ✅ Install dependencies (`pnpm install`)
2. ✅ Add Supabase credentials to `.env.local`
3. ✅ Create database tables (SQL queries above)
4. ✅ Run dev server (`pnpm dev`)
5. ✅ Login with admin/admin@0000
6. ✅ Add sample data
7. ✅ Test all features
8. 📦 Deploy to Vercel (optional)

## Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel Settings
4. Deploy!

## Need Help?

- **Setup Issues**: See `CONFIG_SETUP.md`
- **Full Documentation**: See `README.md` and `PROJECT_SUMMARY.md`
- **Testing**: See `TESTING_GUIDE.md`
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**You're all set! Happy coding! 🎉**

For more detailed instructions, see the other documentation files.
