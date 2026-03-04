import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, toggleCart } from "../../store/uiSlice";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ShoppingCart, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "../../features/cart/CartSheet";
import { ProfileDropdown } from "./ProfileDropdown";

export const MainLayout = () => {
  const { theme, cart } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const { user, logout } = useAuth(true); // Need user for login/logout buttons
  const navigate = useNavigate();


  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1">
              <span
                className="font-bold text-xl text-primary"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                ThreadCraft
              </span>
              <span
                className="font-bold text-xl text-white"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                .
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Button
                variant="link"
                asChild
                className="p-0 text-foreground hover:text-primary"
              >
                <Link to="/products">Shop</Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch(toggleCart())}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 px-1 min-w-5 h-5 flex items-center justify-center rounded-full text-[10px]"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-4 ml-4 border-l pl-4">
                <Button variant="ghost" asChild>
                  <Link to="/orders">Orders</Link>
                </Button>
                {user.role === "ADMIN" && (
                  <Button variant="secondary" asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <ProfileDropdown
                  name={user.name}
                  role={user.role === "ADMIN" ? "Admin" : "User"}
                  avatarUrl={user.avatarUrl}
                  onProfile={() => navigate("/profile")}
                  onSettings={() => navigate("/settings")}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4 border-l pl-4">
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ThreadCraft. The source code is available.
          </p>
        </div>
      </footer>
      <CartSheet />
    </div>
  );
};
