Requirement:
```
Here is the whole requirement
Generate tshit ecommerce web application using react js vite fully js.
Admin Penel to create and manage products Manages inventory and tracks salesAllows Users to browse and purchase products Integrates Stripe (Test Mode) for payments Is deployed live Reflects your own branding and design thinking Brand name Design language Theme and identity Roles: Admin User Required Features: Admin Add product Edit product Delete product Manage inventory View sales analytics (basic total sales + total revenue) User Register / Login View product list View individual product page Purchase product via Stripe (Test Mode) View order history Each product must include: Title Description Price Category Stock Quantity Product Image CreatedAt / UpdatedAt Product Capabilities: Pagination Search by title Filter by category Sort by price Real-time stock deduction after purchase Inventory & Sales System You must implement: Stock reduction after successful paymen Prevent purchase if stock is 0 Sales tracking Total revenue calculation Admin view to monitor sales Bonus (optional but appreciated): Low stock indicator Basic dashboard stats 3.5 Frontend (React) Must include: Landing page Product listing page Individual product page Authentication pages Admin dashboard Clean routing structure Requirements: Functional components React Hooks Clean folder structure Proper state management (Context API or Redux) API integration using Axios or Fetch You have complete creative freedom. Choose: Your brand name Logo (simple is fine) Theme colors Typography Visual direction Important: UI/UX is part of evaluation. A functional but poorly designed experience will score lower. We are evaluating: Layout clarity Responsiveness Accessibility basics Usability Visual consistency
```

Plan:



# ThreadCraft — T-Shirt Ecommerce Store

A fully frontend React + Vite application with mock data, TanStack Query, and a polished UI. No backend — all data lives in local state/localStorage.

## Brand Identity
- **Brand Name**: ThreadCraft
- **Theme**: Modern streetwear aesthetic — dark charcoal background with vibrant accent color (electric indigo/purple), clean sans-serif typography
- **Logo**: Simple text-based logo with a thread/needle icon from Lucide

## Pages & Routing

1. **Landing Page** (`/`) — Hero banner, featured products, categories showcase, CTA
2. **Product Listing** (`/products`) — Grid with pagination, search bar, category filter, price sort
3. **Product Detail** (`/products/:id`) — Image, title, description, price, stock status, add-to-cart
4. **Cart** (`/cart`) — Cart items, quantity adjustment, total, mock Stripe checkout button
5. **Auth Pages** (`/login`, `/register`) — Mock authentication with localStorage
6. **Order History** (`/orders`) — Past orders for logged-in user
7. **Admin Dashboard** (`/admin`) — Stats cards (total sales, revenue, low stock alerts)
8. **Admin Products** (`/admin/products`) — CRUD table for products with add/edit/delete dialogs
9. **Admin Sales** (`/admin/sales`) — Sales list + revenue chart using Recharts

## Data & State Management

- **Mock product data**: 15+ T-shirt products with titles, descriptions, prices, categories (Streetwear, Classic, Graphic, Premium), stock quantities, and placeholder images
- **Context API** for auth state (user role: admin/user) and cart state
- **TanStack Query** wrapping mock async functions to simulate API calls with realistic delays
- **localStorage** persistence for cart, orders, users, product inventory

## Key Features

- **Search** by title, **filter** by category, **sort** by price (low-high, high-low)
- **Pagination** (8 products per page)
- **Stock management**: real-time stock deduction on purchase, disabled buy button when stock = 0, low stock indicator (≤5 units)
- **Mock Stripe checkout**: simulated payment flow with success/failure states
- **Admin CRUD**: add/edit/delete products with form validation (React Hook Form + Zod)
- **Sales analytics**: total revenue, total orders, bar chart of sales over time
- **Role-based routing**: admin pages protected, redirect if unauthorized

## UI/UX

- Fully responsive (mobile-first)
- Dark/light mode toggle
- Consistent card-based layout with shadcn/ui components
- Toast notifications for actions (add to cart, purchase, product saved)
- Loading skeletons during data fetching
- Clean folder structure: `components/`, `pages/`, `context/`, `data/`, `hooks/`, `types/`