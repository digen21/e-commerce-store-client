import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import {
    Home,
    Package,
    DollarSign,
    LogOut,
    ArrowLeft,
    ShoppingCart,
    Users,
    PackageOpen,
    BarChart3,
    Settings,
    Menu,
    X,
    Sparkles,
    Bell,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: Home },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Inventory', path: '/admin/inventory', icon: PackageOpen },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* Mobile Sidebar Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card border shadow-sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar - Fixed on desktop, collapsible on mobile */}
            <aside
                className={cn(
                    'w-56 border-r bg-card flex flex-col h-screen fixed top-0 left-0 transition-transform duration-300 ease-in-out z-40',
                    'lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="p-6 border-b shrink-0">
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

                    {/* <h2 className="text-xl font-bold text-primary tracking-tight">ThreadCraft Admin</h2> */}
                    <p className="text-xs text-muted-foreground mt-1">Manage your store</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Button
                                key={item.path}
                                asChild
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start gap-3 h-11',
                                    isActive
                                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                        : 'hover:bg-accent/10'
                                )}
                            >
                                <Link to={item.path} onClick={() => setSidebarOpen(false)}>
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t space-y-2 shrink-0">
                    <Button asChild variant="ghost" className="w-full justify-start gap-3">
                        <Link to="/" onClick={() => setSidebarOpen(false)}>
                            <ArrowLeft className="h-5 w-5" />
                            Back to Store
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content - Offset by sidebar width */}
            <main className="flex-1 overflow-auto ml-0 lg:ml-56">
                {/* Top Header - Sticky */}
                <div className="sticky top-0 z-30 bg-background">
                    <header className="h-16 border-b flex items-center justify-between px-6 bg-card/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold capitalize">
                            {location.pathname.split('/').pop() === 'admin'
                                ? 'Dashboard'
                                : location.pathname.split('/').pop() || 'Admin'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* AI Assistant Button */}
                        <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span>AI Assistant</span>
                        </Button>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
                            >
                                3
                            </Badge>
                        </Button>

                        {/* User Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="/avatars/user.png" alt={user?.name} />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0) || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {user?.email || 'admin@threadcraft.com'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/admin/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/">View Store</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                </div>

                {/* Page Content */}
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};
