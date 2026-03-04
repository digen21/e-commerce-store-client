You are a senior frontend engineer.
Generate a React (Vite) ecommerce T-shirt store frontend using JavaScript only.

Tech Stack (STRICT):
- React + Vite (JavaScript only)
- React Router v6
- TanStack Query (ALL server state)
- Axios (cookie-based auth, withCredentials enabled)
- Redux Toolkit (ONLY basic UI/global state)
- Formik + Yup (ALL forms & validation)
- Shadcn UI (components & accessibility)

Roles:
- USER
- ADMIN (role comes from auth API response)

Architecture Rules:
- Feature-based folder structure
- No Redux for server data
- One Axios instance
- One QueryClient
- Role-based route protection (AdminRoute, ProtectedRoute)
- Hide admin UI for non-admin users
- Mobile-first, accessible UI



Pages:
Public:
- Landing
- Product List (pagination, search, filter, sort)
- Product Detail
- Login
- Register

User:
- Order History

Admin:
- Dashboard (total sales, total revenue)
- Product CRUD (Formik forms)
- Inventory management
- Low-stock indicator

Forms (Formik + Yup):
- Login
- Register
- Add/Edit Product

State Rules:
- RTK → UI only (sidebar, theme, filters)
- TanStack Query → products, auth, orders, sales

Deliverables:
- Full folder structure
- Key components
- Query hooks (useAuth, useProducts, useOrders)
- RTK store + slice
- Axios setup
- Route protection
- Example Formik form with validation

Design:
- Clean branding
- Consistent theme
- Shadcn components only
- No inline styles
- Responsive layout

Rules:
- Clean folder structure
- Reusable components
- Query hooks per feature (useProducts, useOrders, useAuth)
- No Redux for server data
- Admin routes protected
- Mobile-first, accessible UI
Return full project structure + key files.

Do NOT:
- Use TypeScript
- Use Redux for API data
- Over-abstract
- Skip accessibility basics

Return clean, readable, production-quality code.





You are a senior frontend engineer.
Generate a React (Vite) ecommerce T-shirt store frontend using JavaScript only.

Tech Stack (STRICT):
- React + Vite (JavaScript only)
- React Router v6
- TanStack Query (ALL server state)
- Axios (cookie-based auth, withCredentials enabled)
- Redux Toolkit (ONLY basic UI/global state)
- Formik + Yup (ALL forms & validation)
- Shadcn UI (components & accessibility)

Roles:
- USER
- ADMIN (role comes from auth API response)

Architecture Rules:
- Feature-based folder structure
- No Redux for server data
- One Axios instance
- One QueryClient
- Role-based route protection (AdminRoute, ProtectedRoute)
- Hide admin UI for non-admin users
- Mobile-first, accessible UI



Pages:
Public:
- Landing
- Product List (pagination, search, filter, sort)
- Product Detail
- Login
- Register

User:
- Order History

Admin:
- Dashboard (total sales, total revenue)
- Product CRUD (Formik forms)
- Inventory management
- Low-stock indicator

Forms (Formik + Yup):
- Login
- Register
- Add/Edit Product

State Rules:
- RTK → UI only (sidebar, theme, filters)
- TanStack Query → products, auth, orders, sales

Deliverables:
- Full folder structure
- Key components
- Query hooks (useAuth, useProducts, useOrders)
- RTK store + slice
- Axios setup
- Route protection
- Example Formik form with validation

Design:
- Clean branding
- Consistent theme
- Shadcn components only
- No inline styles
- Responsive layout

Rules:
- Clean folder structure
- Reusable components
- Query hooks per feature (useProducts, useOrders, useAuth)
- No Redux for server data
- Admin routes protected
- Mobile-first, accessible UI
Return full project structure + key files.

Do NOT:
- Use TypeScript
- Use Redux for API data
- Over-abstract
- Skip accessibility basics

Return clean, readable, production-quality code.