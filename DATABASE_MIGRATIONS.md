# Database Migrations - Vellore Santhai Admin

## Required Database Changes

To activate all features in the enhanced admin dashboard, run these SQL migrations in your Supabase SQL Editor.

### 1. Add Email Field to Customers Table

```sql
-- Add email column to customers table if it doesn't exist
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add alternative mobile column if it doesn't exist
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS alt_mobile TEXT;

-- Optional: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
```

### 2. Create Orders Table

```sql
-- Create orders table for order management
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT NOT NULL UNIQUE,
  order_value NUMERIC(10,2) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  calculated_value NUMERIC(10,2) GENERATED ALWAYS AS (order_value * price) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on order_no for faster searches
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON public.orders(order_no);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
```

### 3. Create Blog News Table (if not already created)

```sql
-- Create blog_news table for blog posts
CREATE TABLE IF NOT EXISTS public.blog_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  category TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_news_category ON public.blog_news(category);
CREATE INDEX IF NOT EXISTS idx_blog_news_is_published ON public.blog_news(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_news_created_at ON public.blog_news(created_at DESC);
```

---

## Step-by-Step Migration Guide

### For Existing Deployments

1. **Backup your database** (highly recommended)
   - In Supabase dashboard, go to Backups section
   - Create manual backup

2. **Open SQL Editor**
   - Go to Supabase project dashboard
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Run migrations one at a time**
   - Copy SQL from sections above
   - Paste into SQL editor
   - Click "Run" button
   - Check for success message

4. **Verify tables were created**
   - Go to "Database" section
   - Expand "public" schema
   - Verify tables appear:
     - customers (should have email, alt_mobile columns)
     - orders (new table)
     - blog_news (should exist)

5. **Test the application**
   - Refresh your admin dashboard
   - Try creating an order
   - Try editing customer email field
   - Verify no errors in browser console

---

## Reverting Changes (If Needed)

### Remove Orders Table
```sql
DROP TABLE IF EXISTS public.orders CASCADE;
```

### Remove New Columns from Customers
```sql
ALTER TABLE public.customers
DROP COLUMN IF EXISTS email;

ALTER TABLE public.customers
DROP COLUMN IF EXISTS alt_mobile;
```

### Remove Blog News Table
```sql
DROP TABLE IF EXISTS public.blog_news CASCADE;
```

---

## Checking Current State

### See all columns in customers table
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;
```

### Check if orders table exists
```sql
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'orders'
);
```

### Count records in orders table
```sql
SELECT COUNT(*) as total_orders,
       SUM(calculated_value) as total_sales
FROM public.orders;
```

---

## Row Level Security (RLS) - Optional

If you want to secure these tables with RLS policies:

### Enable RLS on Orders Table
```sql
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all (public access)
-- Adjust based on your auth needs
CREATE POLICY "Enable public access to orders"
ON public.orders
FOR ALL
USING (true)
WITH CHECK (true);
```

### Enable RLS on Blog News Table
```sql
ALTER TABLE public.blog_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable public read access to blog_news"
ON public.blog_news
FOR SELECT
USING (true);

CREATE POLICY "Enable authenticated write to blog_news"
ON public.blog_news
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable authenticated update to blog_news"
ON public.blog_news
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable authenticated delete to blog_news"
ON public.blog_news
FOR DELETE
USING (auth.role() = 'authenticated');
```

---

## Performance Tips

### Add Indexes for Better Queries
```sql
-- For orders
CREATE INDEX idx_orders_customer_id ON public.orders(order_no);
CREATE INDEX idx_orders_price_range ON public.orders(price);

-- For customers
CREATE INDEX idx_customers_name ON public.customers(name);

-- For blog_news
CREATE INDEX idx_blog_news_published_date ON public.blog_news(is_published, created_at DESC);
```

### Analyze Query Performance
```sql
-- Before running a query, enable query analysis
EXPLAIN ANALYZE
SELECT * FROM public.orders WHERE order_no LIKE '%ORD%';
```

---

## Common Issues & Solutions

### Issue: "Table already exists"
- This is fine! The SQL uses `CREATE TABLE IF NOT EXISTS`
- Existing tables won't be modified

### Issue: "Column already exists"
- The SQL uses `ADD COLUMN IF NOT EXISTS`
- Existing columns won't be modified

### Issue: "Permission denied"
- Make sure you're using a role with admin/owner permissions
- In Supabase, this is usually your project owner account

### Issue: PDF generation fails
- Ensure `html2pdf.js` package is installed
- Check browser console for errors
- Try in a different browser

---

## Testing the Migrations

### Test Orders functionality
1. Go to Orders & Billing page
2. Click "Add New Order"
3. Fill in:
   - Order Number: "TEST-001"
   - Quantity: 5
   - Price: 100
4. Click "Create Order"
5. Verify order appears in list
6. Total should show: ₹500

### Test Customer email field
1. Go to Customers page
2. Click on a customer to expand
3. Look for "Email" field
4. Click Edit
5. Enter email: "test@example.com"
6. Click Save
7. Verify email appears in customer card

### Test PDF generation
1. Go to Orders page
2. Find an order
3. Click Download button (📥)
4. Add notes (optional)
5. Click "Download PDF"
6. Verify PDF downloads with order details

---

## Database Maintenance

### Regular Backups
- Enable automatic backups in Supabase
- Create manual backups before major changes
- Keep at least 7 days of backup history

### Clean Up Old Orders
```sql
-- Archive orders older than 1 year
SELECT COUNT(*) as old_orders
FROM public.orders
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Monitor Database Size
```sql
-- Check database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Support

For database-related issues:
1. Check Supabase status page
2. Review error message in SQL editor
3. Verify Supabase credentials are correct
4. Check network connectivity
5. Contact Supabase support if persists

---

**Last Updated**: May 22, 2026
**Version**: 1.0
**Status**: Ready for deployment
