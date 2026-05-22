# Vellore Santhai Admin Dashboard - Setup Guide

## Overview
This is a Next.js 16 admin dashboard for managing the Vellore Santhai e-commerce platform. It includes product management, customer management, and a blog/news system integrated with Supabase PostgreSQL.

## Features

### 1. Authentication
- **Simple hardcoded login**: Username: `admin`, Password: `admin@0000`
- Client-side only authentication (no sessions)
- Redirect to login on unauthorized access

### 2. Dashboard
- Overview with total customer, product, and blog post counts
- Quick navigation to management sections

### 3. Products Management
- View all products in a responsive grid layout
- **Inline editing**: Edit price, image URL, and stock status directly
- Filter products by category (Vegetables & Fruits, Greens, Milk & Dairy, Meat)
- Delete products
- Real-time data sync with Supabase

### 4. Customers Management
- View all customers with contact details
- **View/Edit customer information**: Name, mobile, address
- Delete customers
- Expandable details panel for each customer

### 5. Blog & News Management
- Create new blog posts and news articles
- Two categories: Agriculture News & E-commerce News
- Simple text editor (no rich text)
- Image URL support
- Publish/Draft status toggle
- Edit and delete posts

## Database Setup (Supabase)

### Required Tables

1. **products** (already provided schema)
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

2. **customers** (create new)
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

3. **blog_news** (create new)
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

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings:
1. Go to your Supabase dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" and "anon/public" key

## Installation & Running

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production
```bash
pnpm build
pnpm start
```

## Project Structure

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Root page (redirects to login/dashboard)
├── login/
│   └── page.tsx            # Login page
└── dashboard/
    ├── layout.tsx          # Dashboard layout with sidebar navigation
    ├── page.tsx            # Dashboard overview
    ├── products/
    │   └── page.tsx        # Products management page
    ├── customers/
    │   └── page.tsx        # Customers management page
    └── blog/
        └── page.tsx        # Blog/News management page

lib/
├── supabase.ts             # Supabase client & type definitions
└── user.js                 # Simple authentication utilities

hooks/
├── useProducts.ts          # Products data fetching & mutations
├── useCustomers.ts         # Customers data fetching & mutations
└── useBlog.ts              # Blog posts data fetching & mutations
```

## File Upload & Images

For product and blog images, you can use:
1. **Supabase Storage**: Upload images and get public URLs
2. **External URLs**: Paste direct image URLs from any source
3. **Base64 Data URLs**: For testing/demo purposes

## Default Credentials

| Field | Value |
|-------|-------|
| Username | admin |
| Password | admin@0000 |

## Customization

### Change Login Credentials
Edit `/lib/user.js` and modify:
```javascript
const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'admin@0000'
```

### Modify Categories
Update the `CATEGORIES` arrays in:
- `/app/dashboard/products/page.tsx`
- `/app/dashboard/blog/page.tsx`

### Styling
- Uses **Tailwind CSS** and **shadcn/ui** components
- Global styles in `/app/globals.css`
- Theme configuration in `/tailwind.config.ts`

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not set"
- Make sure `.env.local` exists with correct Supabase credentials
- Restart the dev server after adding environment variables

### Cannot fetch data from Supabase
- Verify Supabase tables are created (see Database Setup section)
- Check that Supabase URL and key are correct
- Ensure tables have proper columns

### Login not working
- Default credentials: `admin` / `admin@0000`
- Credentials are hardcoded in `/lib/user.js`
- Check browser console for any errors

## Future Enhancements

- [ ] Add rich text editor for blog posts
- [ ] Image upload to Supabase Storage
- [ ] Search and filtering for all tables
- [ ] Bulk actions for products/customers
- [ ] Order management section
- [ ] Sales analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support (Tamil/English)

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
