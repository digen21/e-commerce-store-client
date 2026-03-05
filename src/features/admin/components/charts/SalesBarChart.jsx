import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

const SalesBarChart = ({ data, period = 'weekly' }) => {
    const [chartPeriod, setChartPeriod] = React.useState(period);

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

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-lg font-semibold">Sales Performance</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Total Revenue: ${summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
                    <TabsList>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
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
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default SalesBarChart;
