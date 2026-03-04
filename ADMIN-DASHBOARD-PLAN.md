Build a **modern dark-themed Admin Dashboard** for a T-Shirt ecommerce platform called **ThreadCraft** using **React (Vite) + TanStack Query + Shadcn UI + Tailwind CSS + Recharts**.

Design style:

* Dark charcoal background
* Purple / indigo gradient accents
* Soft glassmorphism cards
* Rounded corners and subtle glow effects
* Clean modern SaaS layout similar to premium dashboards

### Layout

Create a **two-column dashboard layout**.

**Left Sidebar Navigation**
Items:

* Dashboard
* Products
* Orders
* Customers
* Inventory
* Sales Analytics
* Settings

Sidebar style:

* Dark background
* Icon + label
* Active item highlighted with purple gradient
* Collapsible on mobile

---

### Top Header

Include:

* Date range selector
* Segment filter dropdown
* “AI Assistant” action button
* User profile avatar

---

### Dashboard Overview Cards

Show four summary cards at the top:

1. Total Products
2. Total Orders
3. Total Revenue
4. Conversion Rate

Each card should include:

* Large metric number
* Percentage change indicator
* Small icon
* Gradient highlight

---

### Sales Performance Chart

Use **Recharts bar chart**.

Display:

* Daily sales revenue
* Tooltip on hover
* Weekly / Monthly toggle

---

### Order Status Chart

Create a **donut chart** displaying:

* Completed Orders
* Pending Orders
* Cancelled Orders
* Failed Payments

Center text:
Total Orders

---

### Recent Orders Table

Columns:

* Order ID
* Customer Name
* Total Amount
* Payment Status
* Order Status
* Date
* Actions

Add:

* Status badges
* Row hover effects
* Pagination

---

### Low Stock Products Widget

Show a small card listing products where:
stock <= 5

Display:

* Product image
* Title
* Remaining stock

---

### State Management

Use **TanStack Query** for:

* Fetching products
* Fetching orders
* Fetching analytics data

---

### Folder Structure

src/
components/
dashboard/
charts/
tables/
layout/
pages/
admin/
hooks/
api/
types/

---

### UI/UX Requirements

* Fully responsive
* Loading skeletons
* Smooth hover animations
* Accessible color contrast
* Consistent spacing system
* Clean modern typography

---

### Goal

Create a **production-quality ecommerce admin panel** with analytics, product management visibility, and sales insights suitable for a modern SaaS dashboard.
