import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const paymentStatusColors = {
    PAID: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    FAILED: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    REFUNDED: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
};

const orderStatusColors = {
    FULFILLED: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    SHIPPING: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    CONFIRMED: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    CREATED: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    FAILED: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    ACCEPTED: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
};

const RecentOrdersTable = ({ orders, onViewOrder }) => {
    if (!orders || orders.length === 0) {
        return (
            <div className="flex items-center justify-center py-10">
                <p className="text-muted-foreground">No recent orders found</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow
                        key={order._id}
                        className="transition-colors hover:bg-muted/50"
                    >
                        <TableCell className="font-medium">
                            <div className="flex flex-col">
                                <span>#{order.orderNumber?.split('-').pop() || order._id.slice(-6)}</span>
                                <span className="text-xs text-muted-foreground">{order.orderNumber}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">{order.user?.name || 'Customer'}</span>
                                <span className="text-xs text-muted-foreground">{order.user?.email || 'N/A'}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                            ${order.totalAmount?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant="secondary"
                                className={paymentStatusColors[order.paymentStatus] || ''}
                            >
                                {order.paymentStatus || 'PENDING'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant="secondary"
                                className={orderStatusColors[order.orderStatus] || ''}
                            >
                                {order.orderStatus || 'CREATED'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                            <span className="text-xs text-muted-foreground ml-1">
                                {format(new Date(order.createdAt), 'HH:mm')}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onViewOrder?.(order)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default RecentOrdersTable;
