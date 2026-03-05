import { format } from 'date-fns';
import { Eye, ExternalLink, FileText, MoreHorizontal, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAdminOrders, useUpdateOrderStatus, useCancelOrder } from '../hooks/useOrders';
import { useInvoice } from '@/features/orders/hooks/useOrders';


const orderStatusOptions = [
    { value: 'CREATED', label: 'Created' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'SHIPPING', label: 'Shipping' },
    { value: 'FULFILLED', label: 'Fulfilled' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

// Status transition rules: which statuses are allowed for each current status
const statusTransitionRules = {
    CREATED: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPING', 'CANCELLED'],
    SHIPPING: ['FULFILLED'],
    FULFILLED: [], // Final state - no transitions allowed
    CANCELLED: [], // Final state - no transitions allowed
    FAILED: [], // Final state - no transitions allowed
    PENDING: ['CREATED', 'ACCEPTED', 'CANCELLED'],
};

// Helper function to get allowed statuses for current status
const getAllowedStatuses = (currentStatus) => {
    return statusTransitionRules[currentStatus] || [];
};

const paymentStatusColors = {
    PAID: 'bg-green-500/10 text-green-500',
    PENDING: 'bg-yellow-500/10 text-yellow-500',
    FAILED: 'bg-red-500/10 text-red-500',
};

const AdminOrders = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [pendingStatusUpdate, setPendingStatusUpdate] = useState({ orderId: null, status: '' });
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
    const [failedReason, setFailedReason] = useState('');
    const limit = 10;

    const { data: ordersData, isLoading, refetch } = useAdminOrders({ page, limit, status: statusFilter, search });
    const updateOrderStatus = useUpdateOrderStatus();
    const cancelOrder = useCancelOrder();
    const { data: invoice, isLoading: invoiceLoading, refetch: refetchInvoice } = useInvoice(selectedOrderId);

    const handleStatusUpdate = async (orderId, newStatus) => {
        // If cancelling, use the cancel order API instead of update status
        if (newStatus === 'CANCELLED') {
            setPendingStatusUpdate({ orderId, status: newStatus });
            setFailedReason('');
            setIsStatusDialogOpen(true);
            return;
        }

        // If confirming, ask for delivery date
        if (newStatus === 'CONFIRMED') {
            setPendingStatusUpdate({ orderId, status: newStatus });
            setEstimatedDeliveryDate('');
            setIsStatusDialogOpen(true);
            return;
        }

        // For other statuses, update directly
        await updateStatus(orderId, newStatus, {});
    };

    const updateStatus = async (orderId, newStatus, additionalData) => {
        // Validate status transition
        const order = orders.find(o => o._id === orderId);
        if (order) {
            const allowedStatuses = getAllowedStatuses(order.orderStatus);
            if (!allowedStatuses.includes(newStatus)) {
                toast.error(`Cannot transition from ${order.orderStatus} to ${newStatus}`);
                return;
            }
        }

        try {
            await updateOrderStatus.mutateAsync({
                orderId,
                orderStatus: newStatus,
                ...additionalData
            });
            toast.success('Order status updated successfully');
            refetch();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update order status');
        }
    };

    const handleConfirmStatusUpdate = async () => {
        const { orderId, status } = pendingStatusUpdate;

        if (status === 'CONFIRMED' && !estimatedDeliveryDate) {
            toast.error('Please select an estimated delivery date');
            return;
        }

        if (status === 'CANCELLED' && !failedReason.trim()) {
            toast.error('Please provide a reason for cancellation');
            return;
        }

        try {
            // Use cancel order API for CANCELLED status
            if (status === 'CANCELLED') {
                await cancelOrder.mutateAsync({
                    orderId,
                    reason: failedReason.trim()
                });
                toast.success('Order cancelled successfully');
            } else {
                // Use update status API for other statuses
                const additionalData = {};
                if (status === 'CONFIRMED' && estimatedDeliveryDate) {
                    additionalData.estimatedDeliveryDate = estimatedDeliveryDate;
                }

                await updateOrderStatus.mutateAsync({
                    orderId,
                    orderStatus: status,
                    ...additionalData
                });
                toast.success('Order status updated successfully');
            }

            refetch();
            setIsStatusDialogOpen(false);
            setPendingStatusUpdate({ orderId: null, status: '' });
        } catch (error) {
            const errorMessage = error?.response?.data?.message ||
                (status === 'CANCELLED' ? 'Failed to cancel order' : 'Failed to update order status');
            toast.error(errorMessage);
        }
    };

    const handleViewInvoice = (orderId) => {
        setSelectedOrderId(orderId);
        setIsInvoiceDialogOpen(true);
        refetchInvoice();
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
                                                    <div className="font-medium">{order.user?.name || 'Customer'}</div>
                                                    <div className="text-xs text-muted-foreground">{order.user?.email || 'N/A'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                ${order.totalAmount?.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={paymentStatusColors[order.paymentStatus] || ''}>
                                                    {order.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {/* Show dropdown only for editable statuses, otherwise show readonly badge */}
                                                {getAllowedStatuses(order.orderStatus).length > 0 ? (
                                                    <Select
                                                        value={order.orderStatus}
                                                        onValueChange={(value) => handleStatusUpdate(order._id, value)}
                                                    >
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue>
                                                                {orderStatusOptions.find(opt => opt.value === order.orderStatus)?.label || order.orderStatus}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {orderStatusOptions
                                                                .filter(option => getAllowedStatuses(order.orderStatus).includes(option.value))
                                                                .map((option) => (
                                                                    <SelectItem
                                                                        key={option.value}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Badge variant="outline">{order.orderStatus}</Badge>
                                                )}
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
                                                        {order.paymentStatus === 'PAID' && (
                                                            <DropdownMenuItem onClick={() => handleViewInvoice(order._id)}>
                                                                <FileText className="h-4 w-4 mr-2" />
                                                                View Invoice
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

            {/* Invoice Dialog */}
            <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Invoice Details
                        </DialogTitle>
                        <DialogDescription>
                            {invoice?.invoiceNumber && `Invoice #${invoice.invoiceNumber}`}
                        </DialogDescription>
                    </DialogHeader>

                    {invoiceLoading ? (
                        <div className="space-y-4 py-8">
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                            <p className="text-center text-muted-foreground">Loading invoice...</p>
                        </div>
                    ) : invoice ? (
                        <div className="space-y-6">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start pb-4 border-b">
                                <div>
                                    <h4 className="font-semibold text-lg">Invoice</h4>
                                    <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">Invoice Date</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Details */}
                            {invoice.customer && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="font-semibold text-sm mb-2">Bill To</h5>
                                        <p className="text-sm">{invoice.customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <h5 className="font-semibold text-sm mb-2">Payment</h5>
                                        <p className="text-sm">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                {invoice.payment?.status || 'PAID'}
                                            </Badge>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(invoice.payment?.paidAt), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Order Info */}
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">Order ID</span>
                                    <span className="font-mono text-sm">#{invoice.order?._id?.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Order Date</span>
                                    <span className="text-sm">
                                        {format(new Date(invoice.order?.createdAt), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="border rounded-lg">
                                <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 font-semibold text-sm border-b">
                                    <div className="col-span-6">Item</div>
                                    <div className="col-span-2 text-center">Qty</div>
                                    <div className="col-span-2 text-right">Price</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>
                                {invoice.items?.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 p-3 text-sm border-b last:border-0">
                                        <div className="col-span-6">{item.product?.title || 'Product'}</div>
                                        <div className="col-span-2 text-center">{item.quantity}</div>
                                        <div className="col-span-2 text-right">${item.unitPrice?.toFixed(2)}</div>
                                        <div className="col-span-2 text-right font-medium">${item.totalPrice?.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-1/2 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${invoice.subtotal?.toFixed(2)}</span>
                                    </div>
                                    {invoice.tax && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Tax ({invoice.tax.rate}%)</span>
                                                <span>${invoice.tax.amount?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground pl-4">
                                                <span>CGST</span>
                                                <span>${invoice.tax.cgst?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground pl-4">
                                                <span>SGST</span>
                                                <span>${invoice.tax.sgst?.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span className="text-primary">${invoice.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            {invoice.payment?.method && (
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Payment Method</span>
                                        <span className="text-sm font-medium">{invoice.payment.method}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-muted-foreground">Unable to load invoice details</p>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        {invoice?.stripeReceiptUrl && (
                            <Button variant="outline" onClick={() => window.open(invoice.stripeReceiptUrl, '_blank')}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View on Stripe
                            </Button>
                        )}
                        <Button onClick={() => setIsInvoiceDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>
                            {pendingStatusUpdate.status === 'CONFIRMED'
                                ? 'Confirm Order - Add Delivery Date'
                                : 'Cancel Order - Provide Reason'}
                        </DialogTitle>
                        <DialogDescription>
                            {pendingStatusUpdate.status === 'CONFIRMED'
                                ? 'Please provide the estimated delivery date for this order.'
                                : 'Please provide a reason for cancelling this order.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        {pendingStatusUpdate.status === 'CONFIRMED' && (
                            <div className="space-y-2">
                                <Label htmlFor="deliveryDate">Estimated Delivery Date</Label>
                                <Input
                                    id="deliveryDate"
                                    type="date"
                                    value={estimatedDeliveryDate}
                                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Select the expected delivery date for this order
                                </p>
                            </div>
                        )}

                        {pendingStatusUpdate.status === 'CANCELLED' && (
                            <div className="space-y-2">
                                <Label htmlFor="failedReason">Cancellation Reason</Label>
                                <textarea
                                    id="failedReason"
                                    value={failedReason}
                                    onChange={(e) => setFailedReason(e.target.value)}
                                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Please explain why this order is being cancelled..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    This reason will be visible to the customer
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsStatusDialogOpen(false)}
                        >
                            Back
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmStatusUpdate}
                            disabled={
                                (pendingStatusUpdate.status === 'CONFIRMED' && !estimatedDeliveryDate) ||
                                (pendingStatusUpdate.status === 'CANCELLED' && !failedReason.trim())
                            }
                        >
                            {pendingStatusUpdate.status === 'CONFIRMED' ? 'Confirm Order' : 'Cancel Order'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminOrders;
