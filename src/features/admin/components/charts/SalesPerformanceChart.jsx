import React, { useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { TrendingUp, BarChart3 } from 'lucide-react';

const SalesPerformanceChart = ({ data, period = 'weekly', onPeriodChange }) => {
    // Use period from props, don't maintain internal state for period
    const chartPeriod = period;
    const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'

    const chartData = useMemo(() => {
        if (!data) return [];

        // Format date based on period
        return data.trends.map((item) => ({
            ...item,
            date: format(parseISO(item.date), chartPeriod === 'weekly' ? 'MMM dd' : 'MMM yyyy'),
            revenue: item.revenue,
            orders: item.orders,
        }));
    }, [data, chartPeriod]);

    const summary = data?.summary || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };

    // Handle period change - notify parent to fetch new data
    const handlePeriodChange = (newPeriod) => {
        if (onPeriodChange) {
            onPeriodChange(newPeriod);
        }
    };

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-lg font-semibold">Sales Performance</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Total Revenue: ${summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Chart Type Toggle */}
                    <Tabs value={chartType} onValueChange={setChartType}>
                        <TabsList className="h-8">
                            <TabsTrigger value="bar" className="h-7 px-2">
                                <BarChart3 className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="line" className="h-7 px-2">
                                <TrendingUp className="h-4 w-4" />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {/* Period Toggle */}
                    <Tabs value={chartPeriod} onValueChange={handlePeriodChange}>
                        <TabsList className="h-8">
                            <TabsTrigger value="weekly" className="h-7 px-2 text-xs">
                                Weekly
                            </TabsTrigger>
                            <TabsTrigger value="monthly" className="h-7 px-2 text-xs">
                                Monthly
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--accent)/0.1)' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value, name) => {
                                        if (name === 'Revenue') {
                                            return [`${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Revenue'];
                                        }
                                        return [value, 'Orders'];
                                    }}
                                />
                                <Bar
                                    dataKey="revenue"
                                    name="Revenue"
                                    fill="url(#colorRevenue)"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorLineRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--accent)/0.1)' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value, name) => {
                                        if (name === 'Revenue') {
                                            return [`${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Revenue'];
                                        }
                                        return [value, 'Orders'];
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fill="url(#colorLineRevenue)"
                                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default SalesPerformanceChart;
