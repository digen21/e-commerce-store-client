import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderStatusDonut = ({ data }) => {
    const totalOrders = data?.totalOrders || 0;

    const chartData = React.useMemo(() => {
        if (!data?.distribution) return [];
        return data.distribution.map((item) => ({
            name: item.status,
            value: item.count,
            percentage: item.percentage,
            color: item.color,
        }));
    }, [data]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                    <p className="text-sm font-semibold">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {data.value} orders ({data.percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const statusColors = {
        FULFILLED: '#22c55e',   // Green
        SHIPPING: '#3b82f6',    // Blue
        CONFIRMED: '#eab308',   // Yellow
        CREATED: '#f97316',     // Orange
        CANCELLED: '#ef4444',   // Red
        FAILED: '#6b7280',      // Gray
        ACCEPTED: '#8b5cf6',    // Purple
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={statusColors[entry.name] || entry.color}
                                        className="transition-opacity hover:opacity-80"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            {/* Removed default Legend, using custom legend below */}
                            <Legend
                                verticalAlign="bottom"
                                height={0}
                                formatter={() => ''}
                            />
                            {/* Center text */}
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-foreground text-sm"
                                style={{ fontSize: '14px' }}
                            >
                                <tspan x="50%" dy="-0.5em" className="fill-muted-foreground" style={{ fontSize: '12px' }}>
                                    Total
                                </tspan>
                                <tspan x="50%" dy="1.2em" className="fill-foreground font-bold" style={{ fontSize: '20px' }}>
                                    {totalOrders.toLocaleString()}
                                </tspan>
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Status legend with counts - Fixed size boxes */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {chartData.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-2 rounded-md bg-muted/50 p-2 h-[52px] overflow-hidden"
                        >
                            <div
                                className="h-3 w-3 rounded-full shrink-0"
                                style={{ backgroundColor: statusColors[item.name] || item.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-xs font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {item.value.toLocaleString()} ({item.percentage}%)
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderStatusDonut;
