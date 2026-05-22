# Testing Guide - Vellore Santhai Admin Dashboard

## Running the Application Locally

### Prerequisites
- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- Supabase account with configured credentials

### Start Development Server
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# App runs at http://localhost:3000
```

## Testing Flows

### 1. Login Page Testing

**URL**: http://localhost:3000/login

**Test Cases**:

| Scenario | Input | Expected Result |
|----------|-------|-----------------|
| Valid login | admin / admin@0000 | Redirects to /dashboard |
| Wrong password | admin / wrongpass | Shows error message |
| Wrong username | baduser / admin@0000 | Shows error message |
| Empty fields | (empty) / (empty) | Shows error message |
| Missing username | (empty) / admin@0000 | Shows error message |
| Missing password | admin / (empty) | Shows error message |

### 2. Dashboard Page Testing

**URL**: http://localhost:3000/dashboard

**Test Cases**:
- [ ] Page loads after successful login
- [ ] Sidebar navigation shows all menu items
- [ ] Stats show correct counts:
  - Total Customers count
  - Total Products count
  - Blog Posts count
- [ ] Quick links section displays
- [ ] Logout button works and redirects to login

### 3. Products Management Testing

**URL**: http://localhost:3000/dashboard/products

**Precondition**: Add sample products to Supabase

**Test Cases**:

```sql
-- Add test products
INSERT INTO public.products (name_en, name_ta, price, weight, category, in_stock)
VALUES 
  ('Tomato', 'தக்காளி', 50, '1 kg', 'veg-fruits', true),
  ('Carrot', 'கேரட்', 40, '500 g', 'veg-fruits', true),
  ('Spinach', 'பாளக்கீரை', 30, '250 g', 'greens', true),
  ('Milk', 'பால்', 60, '1 litre', 'milk-dairy', true),
  ('Chicken', 'கோழி', 250, '1 kg', 'meat', false);
```

**Test Cases**:

| Feature | Expected Behavior |
|---------|-------------------|
| **View Products** | All products display in grid |
| **Filter by Category** | Only products of selected category show |
| **Edit Price** | Click Edit → Change price → Save → Price updates |
| **Edit Image URL** | Click Edit → Paste image URL → Save → Image displays |
| **Edit Stock Status** | Click Edit → Toggle In Stock → Save → Status updates |
| **Delete Product** | Click Delete → Confirm → Product removed from list |
| **Responsive Layout** | Grid adjusts on different screen sizes |

**Price Edit Example**:
1. Find "Tomato" product (₹50)
2. Click "Edit" button
3. Change price from 50 to 75
4. Click "Save"
5. Verify price now shows ₹75
6. Refresh page to confirm change persists

### 4. Customers Management Testing

**URL**: http://localhost:3000/dashboard/customers

**Precondition**: Add sample customers to Supabase

```sql
-- Add test customers
INSERT INTO public.customers (name, mobile, address)
VALUES 
  ('John Doe', '+91 98765 43210', '123 Main Street, Vellore'),
  ('Jane Smith', '+91 87654 32109', '456 Oak Avenue, Chennai'),
  ('Raj Kumar', '+91 76543 21098', '789 Pine Road, Bangalore');
```

**Test Cases**:

| Feature | Expected Behavior |
|---------|-------------------|
| **View Customers** | All customers display as list |
| **Expand Details** | Click customer name → Details panel opens |
| **Collapse Details** | Click again → Panel closes |
| **Edit Details** | Click Edit → Modify name/mobile/address → Save → Updates |
| **Delete Customer** | Click Delete → Confirm → Customer removed |
| **Sorting** | Customers sorted by most recent first |

**Edit Customer Example**:
1. Click on "John Doe" to expand
2. Click "Edit" button
3. Change mobile from "+91 98765 43210" to "+91 11111 11111"
4. Click "Save"
5. Verify mobile number updated
6. Refresh to confirm persistence

### 5. Blog & News Management Testing

**URL**: http://localhost:3000/dashboard/blog

**Test Cases**:

| Feature | Expected Behavior |
|---------|-------------------|
| **Create Post** | Click "Create New Post" → Form opens |
| **Fill Title** | Enter post title in text field |
| **Fill Content** | Enter post content in textarea |
| **Select Category** | Choose "Agriculture News" or "E-commerce News" |
| **Add Image URL** | Paste image URL → Preview displays |
| **Publish Toggle** | Check/uncheck "Publish this post" |
| **Save Post** | Click "Create Post" → Post added to list |
| **Edit Post** | Click Edit → Modify fields → Update Post |
| **Delete Post** | Click Delete → Confirm → Post removed |

**Create Blog Post Example**:
1. Go to Blog & News section
2. Click "Create New Post"
3. Title: "Best Farming Practices"
4. Category: "Agriculture News"
5. Content: "Tips for organic farming in Tamil Nadu..."
6. Image URL: "https://via.placeholder.com/400x300"
7. Check "Publish this post"
8. Click "Create Post"
9. Verify post appears in list with "Published" badge
10. Verify image displays correctly

### 6. Navigation Testing

**Test Cases**:
- [ ] Click "Dashboard" in sidebar → Go to /dashboard
- [ ] Click "Products" in sidebar → Go to /dashboard/products
- [ ] Click "Customers" in sidebar → Go to /dashboard/customers
- [ ] Click "Blog & News" in sidebar → Go to /dashboard/blog
- [ ] All links are clickable and working
- [ ] Active page highlights in sidebar

### 7. Logout Testing

**Test Cases**:
- [ ] Click "Logout" button in top right
- [ ] Redirected to /login
- [ ] Try accessing /dashboard directly → Redirected to login
- [ ] localStorage cleared (user state)

### 8. Error Handling Testing

**Test Cases**:

| Scenario | Expected Behavior |
|----------|-------------------|
| No Supabase credentials | Show error: "supabaseUrl is required" |
| Database table missing | Show error in console |
| Network error | Graceful error display |
| Delete confirmation cancel | Operation cancelled, no deletion |

## Browser Console Testing

Open DevTools (F12) and check Console for:

```javascript
// Test local storage
localStorage.getItem('admin_logged_in')  // Should return 'true' when logged in

// Check Supabase client
console.log(supabase)  // Should show Supabase client object
```

## Responsive Design Testing

Test on different screen sizes:

```bash
# Mobile (375px)
agent-browser set viewport 375 667

# Tablet (768px)
agent-browser set viewport 768 1024

# Desktop (1920px)
agent-browser set viewport 1920 1080
```

## Performance Testing

1. **Load Time**: Check Network tab in DevTools
2. **Bundle Size**: Run `pnpm build` and check `.next/static`
3. **Images**: Verify images load from external URLs

## Automated Testing Script

```bash
#!/bin/bash

# Start dev server
pnpm dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Run browser tests
agent-browser open http://localhost:3000/login

# Test login
agent-browser snapshot
agent-browser fill [username] "admin"
agent-browser fill [password] "admin@0000"
agent-browser click [login-button]

# Test dashboard
agent-browser wait 2000
agent-browser screenshot dashboard.png

# Test products
agent-browser click [products-nav]
agent-browser wait 1000
agent-browser screenshot products.png

# Cleanup
kill $DEV_PID
```

## Testing Checklist

- [ ] Login with correct credentials works
- [ ] Login with wrong credentials shows error
- [ ] Dashboard loads and shows stats
- [ ] All navigation links work
- [ ] Products can be viewed and filtered
- [ ] Products can be edited inline
- [ ] Products can be deleted
- [ ] Customers can be viewed and expanded
- [ ] Customers can be edited
- [ ] Customers can be deleted
- [ ] Blog posts can be created
- [ ] Blog posts can be edited
- [ ] Blog posts can be deleted
- [ ] Images display correctly
- [ ] Logout works and requires re-login
- [ ] App is responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Data persists after page refresh

## Deployment Testing

After deploying to Vercel:

1. Test login with production URL
2. Verify Supabase connection
3. Check all CRUD operations
4. Verify environment variables are set
5. Test on different devices/browsers

## Known Limitations

- No rich text editor (simple text only)
- Images must be uploaded to external service (Supabase Storage or CDN)
- No real-time updates (page refresh needed to see changes)
- Simple authentication (no session management)

## Troubleshooting Tests

| Issue | Check |
|-------|-------|
| Tests fail after Supabase changes | Clear browser cache (Ctrl+Shift+Del) |
| Images not loading | Verify image URLs are HTTPS |
| Products not appearing | Check if products table has data |
| Logout button missing | Check if logged in (isLoggedIn() = true) |

---

For more detailed setup and configuration, see `CONFIG_SETUP.md` and `SETUP.md`.
