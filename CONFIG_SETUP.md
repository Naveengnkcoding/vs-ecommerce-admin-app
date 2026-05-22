# Vellore Santhai Admin - Configuration Setup

## Step 1: Create Supabase Account & Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or login
3. Create a new project
4. Wait for the project to be initialized (this takes a few minutes)

## Step 2: Get Your Supabase Credentials

1. Go to your project dashboard
2. Click on **Settings** → **API** (on the left sidebar)
3. Copy these two values:
   - **Project URL** - This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Create Environment Variables

### Using v0 Settings:
1. Click the **Settings** button (gear icon) in the top right
2. Go to **Vars** section
3. Add two environment variables:
   - Key: `NEXT_PUBLIC_SUPABASE_URL` → Value: Your Project URL
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: Your anon public key

### OR Manually in `.env.local`:
Create a file named `.env.local` in the root of your project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Tables

Go to your Supabase project dashboard and open the **SQL Editor**. Run these queries one by one:

### Table 1: Products
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

### Table 2: Customers
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

### Table 3: Blog News
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

## Step 5: Test the Application

1. Refresh the app (or restart your dev server)
2. Go to http://localhost:3000/login
3. Login with credentials:
   - Username: `admin`
   - Password: `admin@0000`
4. You should be redirected to the dashboard

## Step 6: Add Sample Data (Optional)

### Add a Sample Product:
Go to Supabase → SQL Editor and run:
```sql
INSERT INTO public.products (name_en, name_ta, price, weight, category, image_url, in_stock) 
VALUES 
  ('Tomato', 'தக்காளி', 50.00, '1 kg', 'veg-fruits', 'https://via.placeholder.com/200', true),
  ('Spinach', 'பாளக்கீரை', 30.00, '500 g', 'greens', 'https://via.placeholder.com/200', true),
  ('Milk', 'பால்', 60.00, '1 litre', 'milk-dairy', 'https://via.placeholder.com/200', true);
```

### Add a Sample Customer:
```sql
INSERT INTO public.customers (name, mobile, address) 
VALUES ('John Doe', '+91 98765 43210', '123 Main Street, Vellore');
```

### Add a Sample Blog Post:
```sql
INSERT INTO public.blog_news (title, content, category, image_url, published) 
VALUES ('Best Farming Practices', 'Tips for organic farming...', 'agri-news', 'https://via.placeholder.com/400', true);
```

## Troubleshooting

### Error: "supabaseUrl is required"
- ✅ Check that `NEXT_PUBLIC_SUPABASE_URL` is set in your environment variables
- ✅ Restart your dev server after adding the env var
- ✅ Make sure there are no typos in the URL

### Error: "Cannot read properties of undefined"
- ✅ Verify the Supabase URL format: `https://project-name.supabase.co`
- ✅ Make sure both URL and KEY are set (not just one)

### Tables don't appear in Dashboard
- ✅ Check if the tables are created in Supabase SQL Editor
- ✅ The dashboard counts are based on table records, so if tables are empty, counts will be 0

### Login not working
- ✅ Default credentials: `admin` / `admin@0000`
- ✅ This is hardcoded and doesn't require Supabase (it's just for the admin panel)

### Products/Customers/Blog pages show no data
- ✅ Make sure tables are created first (see Step 4)
- ✅ Add some sample data (see Step 6)
- ✅ Check browser console (F12) for any error messages

## Quick Reference

| Feature | Status | Requires Supabase |
|---------|--------|-------------------|
| Login | ✅ Works without Supabase | No |
| Dashboard (stats) | ❌ Needs Supabase | Yes |
| Products Management | ❌ Needs Supabase | Yes |
| Customers Management | ❌ Needs Supabase | Yes |
| Blog & News | ❌ Needs Supabase | Yes |

## What's Next?

Once everything is working:
1. **Upload Images**: Use Supabase Storage to upload product/blog images
2. **Customize Data**: Add your own products, customers, and blog posts
3. **Deploy**: Deploy to Vercel using the "Publish" button
4. **Change Login**: Edit `/lib/user.js` to change admin credentials
5. **Add More Features**: Expand with orders, analytics, email notifications, etc.
