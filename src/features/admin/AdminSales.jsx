import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SalesPerformanceChart from './components/charts/SalesPerformanceChart';
import { useSalesTrends } from './hooks/useAdminDashboard';
import { useAdminOrders } from './hooks/useOrders';


const AdminSales = () => {
    const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 100 });
    const { data: salesData, isLoading: salesLoading } = useSalesTrends('weekly');
    const orders = ordersData?.orders || [];

    const summary = salesData?.summary || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Sales Analytics</h2>
                <p className="text-muted-foreground">Monitor your revenue and recent orders</p>
            </div>

            {/* Sales Performance Chart */}
            {salesLoading ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="h-[350px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <SalesPerformanceChart data={salesData} period="weekly" />
            )}

            {/* Recent Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Total Orders: {summary.totalOrders} | Total Revenue: ${summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </CardHeader>
                <CardContent>
                    {ordersLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-muted/50 rounded-md animate-pulse" />
                            ))}
                        </div>
                    ) : orders?.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No recent transactions found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders?.slice().reverse().slice(0, 10).map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium">#{order.orderNumber?.split('-').pop() || order._id.slice(-6)}</TableCell>
                                        <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell>{order.customer?.name || 'Customer'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{order.items?.reduce((acc, it) => acc + (it.quantity || 0), 0)} items</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                            ${order.totalAmount?.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSales;
