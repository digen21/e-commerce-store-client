import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import ForgotPassword from './features/auth/ForgotPassword';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ResetPassword from './features/auth/ResetPassword';
import ResendVerification from './features/auth/ResendVerification';
import VerifyEmail from './features/auth/VerifyEmail';
import ProductDetail from './features/products/ProductDetail';
import ProductList from './features/products/ProductList';
import Landing from './features/public/Landing';

// Protected Pages
import { Toaster } from '@/components/ui/sonner';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminProducts from './features/admin/AdminProducts';
import AdminSales from './features/admin/AdminSales';
import AdminOrders from './features/admin/pages/Orders';
import AdminCustomers from './features/admin/pages/Customers';
import AdminInventory from './features/admin/pages/Inventory';
import AdminSettings from './features/admin/pages/Settings';
import Checkout from './features/checkout/Checkout';
import OrderHistory from './features/orders/OrderHistory';
import PaymentSuccess from './features/payment/PaymentSuccess';
import PaymentFailure from './features/payment/PaymentFailure';
import { AdminRoute, ProtectedRoute } from './routes/ProtectedRoutes';

function App() {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    // Apply theme class to root html element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Auth is checked via useQuery in the child routes or via context. 
  // For standard "No Redux for server data", we use TanStack query for auth session state

  return (
    <Router>
      <Routes>
        {/* Public Routes with Main Navbar & Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email/processing" element={<VerifyEmail />} />
          <Route path="/verify-mail" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/form" element={<ResetPassword />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
          </Route>
        </Route>

        {/* Admin Routes with Admin Sidebar & Dashboard Shell */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/sales" element={<AdminSales />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/analytics" element={<AdminSales />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
