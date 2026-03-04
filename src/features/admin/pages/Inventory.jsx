import React from 'react';
import { useInventoryOverview, useLowStockProducts, useAdjustStock } from '../hooks/useInventory';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import OverviewCards from '../components/widgets/OverviewCards';
import LowStockWidget from '../components/widgets/LowStockWidget';

const AdminInventory = () => {
    const { data: inventory, isLoading } = useInventoryOverview();
    const { data: lowStock } = useLowStockProducts(5);
    const adjustStock = useAdjustStock();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="h-20 bg-muted/50 rounded-md animate-pulse" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const overviewCards = {
        totalProducts: inventory?.totalProducts || 0,
        totalOrders: 0,
        totalRevenue: inventory?.totalStockValue || 0,
        conversionRate: 0,
        metrics: {
            productsChange: 0,
            ordersChange: 0,
            revenueChange: 0,
            conversionChange: 0,
        },
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
                <p className="text-muted-foreground">Track and manage your stock levels</p>
            </div>

            {/* Overview Cards */}
            <OverviewCards data={overviewCards} />

            {/* Inventory Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                        <Package className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory?.inStockCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Products available</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory?.lowStockCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Need attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory?.outOfStockCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Need restocking</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{inventory?.totalStockValue?.toLocaleString('en-IN') || '0'}</div>
                        <p className="text-xs text-muted-foreground">Total inventory value</p>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Stock by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {inventory?.categories?.map((category) => (
                            <div key={category.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{category.name}</span>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{category.count} products</span>
                                        <span className="font-semibold text-primary">₹{category.stockValue?.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <Progress value={(category.count / inventory.totalProducts) * 100} className="h-2" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Low Stock Products */}
            <LowStockWidget products={lowStock?.products || []} />
        </div>
    );
};

export default AdminInventory;
