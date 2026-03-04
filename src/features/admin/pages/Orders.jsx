import React, { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Eye, CheckCircle2, XCircle, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const orderStatusOptions = [
    { value: 'CREATED', label: 'Created', icon: CheckCircle2 },
    { value: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
    { value: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { value: 'SHIPPING', label: 'Shipping', icon: Truck },
    { value: 'FULFILLED', label: 'Fulfilled', icon: CheckCircle2 },
    { value: 'CANCELLED', label: 'Cancelled', icon: XCircle },
    { value: 'FAILED', label: 'Failed', icon: XCircle },
];

const paymentStatusColors = {
    PAID: 'bg-green-500/10 text-green-500',
    PENDING: 'bg-yellow-500/10 text-yellow-500',
    FAILED: 'bg-red-500/10 text-red-500',
};

const orderStatusColors = {
    CREATED: 'bg-orange-500/10 text-orange-500',
    ACCEPTED: 'bg-purple-500/10 text-purple-500',
    CONFIRMED: 'bg-yellow-500/10 text-yellow-500',
    SHIPPING: 'bg-blue-500/10 text-blue-500',
    FULFILLED: 'bg-green-500/10 text-green-500',
    CANCELLED: 'bg-red-500/10 text-red-500',
    FAILED: 'bg-red-500/10 text-red-500',
};

const AdminOrders = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const limit = 10;

    const { data: ordersData, isLoading, refetch } = useAdminOrders({ page, limit, status: statusFilter, search });
    const updateOrderStatus = useUpdateOrderStatus();

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus.mutateAsync({ orderId, orderStatus: newStatus });
            toast.success('Order status updated successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const orders = ordersData?.orders || [];
    const totalPages = ordersData?.pagination?.totalPages || 1;
    const totalOrders = ordersData?.pagination?.total || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Manage and track all customer orders</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Export CSV</Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order number, customer name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter || 'all'} onValueChange={(val) => setStatusFilter(val === 'all' ? '' : val)}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {orderStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {totalOrders} {totalOrders === 1 ? 'Order' : 'Orders'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-muted/50 rounded-md animate-pulse" />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No orders found
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell className="font-medium">
                                                #{order.orderNumber?.split('-').pop() || order._id.slice(-6)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{order.customer?.name}</div>
                                                    <div className="text-xs text-muted-foreground">{order.customer?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                ₹{order.totalAmount?.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={paymentStatusColors[order.paymentStatus] || ''}>
                                                    {order.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={orderStatusColors[order.orderStatus] || ''}>
                                                    {order.orderStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        {order.orderStatus !== 'FULFILLED' && order.orderStatus !== 'CANCELLED' && (
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'SHIPPING')}>
                                                                <Truck className="h-4 w-4 mr-2" />
                                                                Mark as Shipping
                                                            </DropdownMenuItem>
                                                        )}
                                                        {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'FULFILLED' && (
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleStatusUpdate(order._id, 'CANCELLED')}
                                                            >
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalOrders)} of {totalOrders} orders
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOrders;
