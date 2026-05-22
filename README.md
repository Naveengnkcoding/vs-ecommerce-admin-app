# Vellore Santhai Admin Dashboard

A complete Next.js 16 admin dashboard for managing an e-commerce platform with product management, customer management, and a blog/news system.

## ✨ Features at a Glance

- **Simple Admin Login**: Hardcoded credentials (admin / admin@0000) for quick setup
- **Dashboard Stats**: Real-time overview of customers, products, and blog posts
- **Product Management**: View, edit prices/images, filter by category, delete products
- **Customer Management**: View, edit customer info (name, mobile, address), delete customers
- **Blog & News**: Create, edit, publish agricultural and e-commerce news articles
- **Supabase Integration**: PostgreSQL database with automatic CRUD operations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Auto-detect system preference

## 🚀 Quick Start

### 1. Setup Environment Variables

Add to `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase Dashboard → Settings → API

### 2. Create Database Tables

Go to Supabase SQL Editor and copy-paste from `CONFIG_SETUP.md` (Step 4)

Or run this quick command:
```bash
# In Supabase SQL Editor, run all 3 table creation queries from CONFIG_SETUP.md
```

### 3. Install & Run

```bash
pnpm install
pnpm dev
```

Then visit: http://localhost:3000/login

### 4. Login

```
Username: admin
Password: admin@0000
```

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | This file - Quick overview |
| `SETUP.md` | Detailed setup instructions and tech stack |
| `CONFIG_SETUP.md` | Step-by-step Supabase configuration |
| `PROJECT_SUMMARY.md` | Complete project structure and design |
| `TESTING_GUIDE.md` | How to test all features |

## 📁 Project Files Created

### Core Files
```
app/
├── layout.tsx                 # Root layout with metadata
├── page.tsx                   # Auto-redirect to login/dashboard
├── login/page.tsx            # Login page (admin/admin@0000)
└── dashboard/                # All dashboard pages
    ├── layout.tsx            # Dashboard layout with sidebar
    ├── page.tsx              # Dashboard overview
    ├── products/page.tsx     # Product management
    ├── customers/page.tsx    # Customer management
    └── blog/page.tsx         # Blog & news management

lib/
├── supabase.ts               # Supabase client + types
├── user.js                   # Auth utilities

hooks/
├── useProducts.ts            # Products CRUD
├── useCustomers.ts           # Customers CRUD
└── useBlog.ts                # Blog posts CRUD
```

### Documentation
- `SETUP.md` - Detailed setup guide
- `CONFIG_SETUP.md` - Supabase configuration steps
- `PROJECT_SUMMARY.md` - Complete project overview
- `TESTING_GUIDE.md` - Testing procedures
- `README.md` - This file

## 🎯 Key Features Explained

### 1. Products Management
- **View**: See all products with images, prices, and stock status
- **Filter**: Filter by category (Vegetables, Greens, Dairy, Meat)
- **Edit**: Inline editing for price, image URL, stock status
- **Delete**: Remove products with confirmation
- **Categories**: veg-fruits, greens, milk-dairy, meat

### 2. Customers Management
- **View**: List of all registered customers
- **Expand**: Click to see full details (name, mobile, address)
- **Edit**: Update customer information
- **Delete**: Remove customers from database

### 3. Blog & News
- **Create**: Write articles with title, content, category
- **Categories**: Agriculture News or E-commerce News
- **Images**: Add featured image URL
- **Publish**: Toggle publish status (draft/published)
- **Edit**: Update articles anytime
- **Delete**: Remove articles

### 4. Dashboard
- **Stats**: Real-time counts of customers, products, blog posts
- **Navigation**: Easy sidebar navigation to all sections
- **Logout**: Sign out and return to login

## 🗄️ Database Schema

### Products Table
```sql
- id (UUID)
- name_en, name_ta (English & Tamil names)
- price (Decimal)
- weight (e.g., "1 kg", "500 g")
- category (veg-fruits | greens | milk-dairy | meat)
- image_url (Image link)
- in_stock (Boolean)
- sort_order (Display order)
- created_at, updated_at (Timestamps)
```

### Customers Table
```sql
- id (UUID)
- name
- mobile
- address
- created_at, updated_at
```

### Blog News Table
```sql
- id (UUID)
- title
- content
- category (agri-news | ecommerce-news)
- image_url
- published (Boolean)
- created_at, updated_at
```

## 🔑 Login Credentials

| Field | Value |
|-------|-------|
| Username | admin |
| Password | admin@0000 |

**Note**: Credentials are hardcoded in `/lib/user.js` - Edit to change them.

## 🛠️ Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript** - Type-safe JavaScript
- **Supabase** - PostgreSQL database
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Pre-built UI components
- **React Hook Form** - Form management
- **Lucide React** - Icons

## 🚢 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy

### Custom Domain
1. In Vercel, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## 🔐 Security Notes

- **Authentication**: Simple hardcoded credentials (suitable for single admin)
- **No Session Tokens**: Uses localStorage for logged-in state
- **Public Anon Key**: Using Supabase public anon key is standard for client apps
- **For Production**: Consider implementing proper auth with Supabase Auth if multiple users are needed

## 🐛 Troubleshooting

### "supabaseUrl is required"
→ Add `NEXT_PUBLIC_SUPABASE_URL` to `.env.local` and restart dev server

### Dashboard shows 0 customers
→ Create the customers table and add sample data (see CONFIG_SETUP.md)

### Images not displaying
→ Use full HTTPS URLs (e.g., `https://example.com/image.jpg`)

### Login not working
→ Default credentials: `admin` / `admin@0000` (edit `/lib/user.js` to change)

For more issues, see `TESTING_GUIDE.md` troubleshooting section.

## 📚 File Structure

```
vellore-santhai-admin/
├── app/                       # Next.js app directory
├── lib/                       # Utility functions
├── hooks/                     # Custom React hooks
├── components/ui/             # shadcn UI components
├── public/                    # Static assets
├── SETUP.md                   # Setup guide
├── CONFIG_SETUP.md            # Configuration steps
├── PROJECT_SUMMARY.md         # Project overview
├── TESTING_GUIDE.md           # Testing procedures
├── README.md                  # This file
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
└── next.config.mjs           # Next.js config
```

## 💡 Tips & Tricks

1. **Add Sample Data**:
   ```sql
   INSERT INTO public.products VALUES (DEFAULT, 'Tomato', 'தக்காளி', 50, '1 kg', 'veg-fruits', '', true, 0, DEFAULT, DEFAULT);
   ```

2. **Change Admin Credentials**:
   Edit `/lib/user.js` and modify `VALID_USERNAME` and `VALID_PASSWORD`

3. **Add Image**:
   Paste full URL: `https://example.com/product.jpg`

4. **Filter Products**:
   Use the dropdown on products page to filter by category

5. **Responsive Design**:
   The layout automatically adjusts for mobile, tablet, and desktop

## 📞 Support

- **Setup Issues**: See `CONFIG_SETUP.md`
- **Feature Questions**: Check `PROJECT_SUMMARY.md`
- **Testing Help**: See `TESTING_GUIDE.md`
- **Supabase Help**: https://supabase.com/docs
- **Next.js Help**: https://nextjs.org/docs

## 🎯 What's Working

✅ Login/Logout
✅ Dashboard with stats
✅ View products
✅ Edit products inline
✅ Delete products
✅ Filter products by category
✅ View customers
✅ Edit customers
✅ Delete customers
✅ Create blog posts
✅ Edit blog posts
✅ Delete blog posts
✅ Responsive design
✅ Image display from URLs

## 🔮 Future Enhancements

- Rich text editor for blog content
- Direct image upload to Supabase Storage
- Order management section
- Sales analytics and charts
- CSV import/export for products
- Multi-language admin interface
- User roles and permissions
- Email notifications
- Two-factor authentication

## 📄 License

This project is created with v0 by Vercel.

---

**Version**: 1.0  
**Created**: 2026  
**Last Updated**: May 2026
