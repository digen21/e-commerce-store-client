import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import OrderStatusDonut from './components/charts/OrderStatusDonut';
import SalesPerformanceChart from './components/charts/SalesPerformanceChart';
import RecentOrdersTable from './components/tables/RecentOrdersTable';
import LowStockWidget from './components/widgets/LowStockWidget';
import OverviewCards from './components/widgets/OverviewCards';
import {
    useAdminDashboard,
    useOrderStatusDistribution,
    useSalesTrends,
} from './hooks/useAdminDashboard';
import { useLowStockProducts } from './hooks/useInventory';
import { useAdminOrders } from './hooks/useOrders';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [salesPeriod, setSalesPeriod] = useState('weekly');
    const { data: dashboard, isLoading: dashboardLoading } = useAdminDashboard();
    const { data: salesData, isLoading: salesLoading } = useSalesTrends(salesPeriod);
    const { data: orderStatusData, isLoading: orderStatusLoading } = useOrderStatusDistribution();
    const { data: lowStockData, isLoading: lowStockLoading } = useLowStockProducts(5);
    const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 5 });

    const handleViewOrder = (order) => {
        // Navigate to order details or open modal
    };

    if (dashboardLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin!</h1>
                <p className="text-muted-foreground">
                    Here's what's happening with your store today.
                </p>
            </div>

            {/* Overview Cards */}
            <OverviewCards data={dashboard} />

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Sales Performance Chart */}
                {salesLoading ? (
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[350px] w-full" />
                        </CardContent>
                    </Card>
                ) : (
                    <SalesPerformanceChart 
                        data={salesData} 
                        period={salesPeriod}
                        onPeriodChange={setSalesPeriod}
                    />
                )}

                {/* Order Status Donut Chart */}
                {orderStatusLoading ? (
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                ) : (
                    <OrderStatusDonut data={orderStatusData} />
                )}
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders Table */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Latest orders from your store
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {ordersLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : (
                            <RecentOrdersTable
                                orders={ordersData?.orders || []}
                                onViewOrder={handleViewOrder}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Low Stock Widget */}
                {lowStockLoading ? (
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                ) : (
                    <LowStockWidget products={lowStockData?.products || []} />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
