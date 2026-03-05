import { format } from 'date-fns';
import { ExternalLink, FileText, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCancelOrder, useInvoice, useOrders } from './hooks/useOrders';

const orderStatusColors = {
    CREATED: 'bg-orange-500/10 text-orange-500',
    ACCEPTED: 'bg-purple-500/10 text-purple-500',
    CONFIRMED: 'bg-yellow-500/10 text-yellow-500',
    SHIPPING: 'bg-blue-500/10 text-blue-500',
    FULFILLED: 'bg-green-500/10 text-green-500',
    CANCELLED: 'bg-red-500/10 text-red-500',
    FAILED: 'bg-red-500/10 text-red-500',
};

const paymentStatusColors = {
    PAID: 'bg-green-500/10 text-green-500',
    PENDING: 'bg-yellow-500/10 text-yellow-500',
    FAILED: 'bg-red-500/10 text-red-500',
};

const OrderHistory = () => {
    const [page, setPage] = useState(1);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const limit = 10;
    const { data: orderData, isLoading } = useOrders(page, limit);
    const { data: invoice, isLoading: invoiceLoading, refetch: refetchInvoice } = useInvoice(selectedOrderId);
    const cancelOrder = useCancelOrder();

    const orders = orderData?.orders || [];
    const totalPages = orderData?.pagination?.totalPages || 1;
    // const totalOrders = orderData?.pagination?.totalDocs || 0;

    const handleViewInvoice = (orderId) => {
        setSelectedOrderId(orderId);
        setIsInvoiceDialogOpen(true);
        refetchInvoice();
    };

    const handleCancelOrder = (order) => {
        setOrderToCancel(order);
        setIsCancelDialogOpen(true);
    };

    const confirmCancelOrder = async () => {
        try {
            await cancelOrder.mutateAsync({ orderId: orderToCancel._id });
            toast.success('Order cancelled successfully');
            setIsCancelDialogOpen(false);
            setOrderToCancel(null);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Failed to cancel order';
            toast.error(errorMessage);
        }
    };

    // Check if order can be cancelled (not shipped/fulfilled)
    const canCancelOrder = (order) => {
        const nonCancellableStatuses = ['SHIPPING', 'FULFILLED', 'CANCELLED', 'FAILED'];
        return !nonCancellableStatuses.includes(order.orderStatus);
    };

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                                    <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2].map((j) => (
                                        <div key={j} className="flex gap-4">
                                            <div className="h-16 w-16 bg-muted animate-pulse rounded" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                                                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">You have no past orders.</h2>
                <p className="text-muted-foreground">Start shopping to see your orders here!</p>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Order History</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <Card key={order._id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Order Placed</p>
                                    <p className="font-semibold">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total</p>
                                    <p className="font-bold text-primary">${order.totalAmount?.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Order ID</p>
                                    <p className="font-semibold">#{order._id.slice(-8)}</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge
                                            variant="secondary"
                                            className={orderStatusColors[order.orderStatus] || 'bg-gray-500/10 text-gray-500'}
                                        >
                                            {order.orderStatus}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-normal"
                                        >
                                            Order Status
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge
                                            variant="secondary"
                                            className={paymentStatusColors[order.paymentStatus] || 'bg-gray-500/10 text-gray-500'}
                                        >
                                            {order.paymentStatus}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-normal"
                                        >
                                            Payment
                                        </Badge>
                                    </div>
                                </div>
                                {order.paymentStatus === 'SUCCESS' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewInvoice(order._id)}
                                        className="gap-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        View Invoice
                                    </Button>
                                )}
                                {canCancelOrder(order) && (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleCancelOrder(order)}
                                        className="gap-2"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Cancel Order
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {order.items?.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center sm:items-start p-4 hover:bg-accent/10 rounded-md transition-colors border-b last:border-0 border-dashed"
                                    >
                                        <div className="flex gap-4">
                                            {item.product?.images?.[0] && (
                                                <div className="hidden sm:block">
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product?.title || 'Product'}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold">{item.product?.title || 'Product'}</h3>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                {item.size && (
                                                    <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="font-bold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

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

            {/* Cancel Order Confirmation Dialog */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-destructive" />
                            Cancel Order
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {orderToCancel && (
                        <div className="py-4">
                            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order ID</span>
                                    <span className="font-mono">#{orderToCancel._id?.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Amount</span>
                                    <span className="font-semibold">${orderToCancel.totalAmount?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Current Status</span>
                                    <Badge variant="secondary" className={orderStatusColors[orderToCancel.orderStatus]}>
                                        {orderToCancel.orderStatus}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCancelDialogOpen(false)}
                            disabled={cancelOrder.isPending}
                        >
                            No, Keep Order
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmCancelOrder}
                            disabled={cancelOrder.isPending}
                        >
                            {cancelOrder.isPending ? 'Cancelling...' : 'Yes, Cancel Order'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
