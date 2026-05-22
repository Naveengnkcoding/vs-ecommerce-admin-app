# Database Setup Guide for Vellore Santhai Admin

## Overview

Your Supabase database already has the **products** and **customers** tables configured. You need to create the **blog_news** table to enable the blog functionality.

---

## Current Tables Status

### ✅ Products Table (Already Exists)
```sql
CREATE TABLE IF NOT EXISTS public.products (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en       text          NOT NULL,
  name_ta       text          NOT NULL,
  price         numeric(10,2) NOT NULL,
  weight        text          NOT NULL,        -- e.g. "1 kg", "500 g"
  category      text          NOT NULL,        -- 'veg-fruits' | 'greens' | 'milk-dairy' | 'meat'
  image_url     text          DEFAULT '',
  in_stock      boolean       DEFAULT true,
  sort_order    int           DEFAULT 0,
  created_at    timestamptz   DEFAULT now(),
  updated_at    timestamptz   DEFAULT now()
);
```

### ✅ Customers Table (Already Exists)
Stores customer information with name, mobile, and address fields.

### ❌ Blog News Table (NEEDS TO BE CREATED)

---

## Creating the blog_news Table

Run this SQL in your Supabase SQL Editor to create the blog_news table:

```sql
CREATE TABLE IF NOT EXISTS public.blog_news (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text          NOT NULL,
  content       text          NOT NULL,
  image_url     text          DEFAULT '',
  category      text          NOT NULL,        -- 'agriculture-news' | 'ecommerce-news'
  is_published  boolean       DEFAULT false,
  created_at    timestamptz   DEFAULT now(),
  updated_at    timestamptz   DEFAULT now()
);
```

### Table Columns Explanation

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `title` | text | Blog post title |
| `content` | text | Main blog post content |
| `image_url` | text | URL to featured image |
| `category` | text | Either 'agriculture-news' or 'ecommerce-news' |
| `is_published` | boolean | Controls if post is visible |
| `created_at` | timestamp | When post was created |
| `updated_at` | timestamp | When post was last modified |

---

## How to Create the Table

### Step 1: Go to Supabase Dashboard
1. Visit [supabase.com](https://supabase.com)
2. Log in to your account
3. Open your project: **euyxiqmqznqgonkzuhqu**

### Step 2: Open SQL Editor
1. Click on "SQL Editor" in the left sidebar
2. Click "New Query" button

### Step 3: Copy and Paste the SQL
Copy the SQL code above and paste it into the query editor.

### Step 4: Execute the Query
Click the "Run" button (or press Ctrl+Enter) to create the table.

### Step 5: Verify the Table
- Go to "Table Editor" in the left sidebar
- You should now see "blog_news" in the tables list
- Click on it to view the table structure

---

## Sample Data (Optional)

You can optionally add some sample blog posts using this SQL:

```sql
INSERT INTO public.blog_news (title, content, image_url, category, is_published)
VALUES
(
  'Benefits of Organic Farming',
  'Organic farming practices reduce environmental impact and produce healthier crops. Learn about sustainable methods that are transforming agriculture in Vellore district.',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
  'agriculture-news',
  true
),
(
  'New E-commerce Features Available',
  'We have launched several new features to improve your shopping experience including faster checkout, multiple payment options, and real-time order tracking.',
  'https://images.unsplash.com/photo-1460925895917-adf4e566c239?w=800',
  'ecommerce-news',
  true
);
```

---

## Testing After Table Creation

Once you've created the blog_news table:

1. Go back to your admin dashboard
2. Navigate to the **Blog & News** page
3. Click **Create New Post**
4. Fill in the form with test data
5. Click **Create Post**
6. The error should disappear and your blog posts will show up

---

## Troubleshooting

### Error: "relation 'blog_news' does not exist"
- The table hasn't been created yet
- Follow the steps above to create it

### Error: "Failed to fetch blog posts"
- Wait a moment and refresh the page
- Check that the table was created successfully in Supabase

### Posts not saving
- Check that you have the correct Supabase credentials in `.env.local`
- Verify the table schema matches exactly

---

## Database Connection Info

Your Supabase project details (already configured in `.env.local`):
- **URL**: https://euyxiqmqznqgonkzuhqu.supabase.co
- **Project ID**: euyxiqmqznqgonkzuhqu
- **Region**: (Check in Supabase dashboard)

All environment variables are already set up. No additional configuration needed after you create the blog_news table!
