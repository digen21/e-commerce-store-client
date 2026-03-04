import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';

const overviewConfig = {
    totalProducts: {
        title: 'Total Products',
        icon: Package,
        gradient: 'from-purple-500/10 to-indigo-500/10',
        iconColor: 'text-purple-500',
        formatValue: (value) => value.toLocaleString(),
    },
    totalOrders: {
        title: 'Total Orders',
        icon: ShoppingBag,
        gradient: 'from-blue-500/10 to-cyan-500/10',
        iconColor: 'text-blue-500',
        formatValue: (value) => value.toLocaleString(),
    },
    totalRevenue: {
        title: 'Total Revenue',
        icon: DollarSign,
        gradient: 'from-green-500/10 to-emerald-500/10',
        iconColor: 'text-green-500',
        formatValue: (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    },
    conversionRate: {
        title: 'Conversion Rate',
        icon: TrendingUp,
        gradient: 'from-orange-500/10 to-amber-500/10',
        iconColor: 'text-orange-500',
        formatValue: (value) => `${value.toFixed(2)}%`,
    },
};

const OverviewCards = ({ data }) => {
    if (!data) return null;

    const { totalProducts, totalOrders, totalRevenue, conversionRate, metrics } = data;

    const cards = [
        { key: 'totalProducts', value: totalProducts, change: metrics?.productsChange },
        { key: 'totalOrders', value: totalOrders, change: metrics?.ordersChange },
        { key: 'totalRevenue', value: totalRevenue, change: metrics?.revenueChange },
        { key: 'conversionRate', value: conversionRate, change: metrics?.conversionChange },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ key, value, change }) => {
                const config = overviewConfig[key];
                const Icon = config.icon;
                const isPositive = change >= 0;

                return (
                    <Card
                        key={key}
                        className={cn(
                            'relative overflow-hidden transition-all hover:shadow-lg',
                            'bg-gradient-to-br',
                            config.gradient
                        )}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {config.title}
                            </CardTitle>
                            <Icon className={cn('h-4 w-4', config.iconColor)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{config.formatValue(value)}</div>
                            {change !== undefined && (
                                <div className="flex items-center gap-1 mt-1">
                                    <span
                                        className={cn(
                                            'text-xs font-medium',
                                            isPositive ? 'text-green-500' : 'text-red-500'
                                        )}
                                    >
                                        {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        vs last period
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default OverviewCards;
