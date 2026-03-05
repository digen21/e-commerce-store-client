import { CheckCircle2, Clock, Home, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const sessionId = searchParams.get('session_id');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!sessionId) {
                setError('No payment session found');
                setLoading(false);
                return;
            }

            try {
                // Fetch order details using the session ID
                // The backend should have an endpoint to verify payment and get order details
                const response = await api.get(`/orders/verify-payment?session_id=${sessionId}`);

                if (response.data.success) {
                    setOrder(response.data.data.order);
                } else {
                    setError('Unable to fetch order details');
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                // Fallback: try to get order from orders list
                try {
                    const ordersResponse = await api.get('/orders?limit=1');
                    if (ordersResponse.data.success && ordersResponse.data.data.length > 0) {
                        const latestOrder = ordersResponse.data.data[0];
                        if (latestOrder.paymentStatus === 'SUCCESS') {
                            setOrder(latestOrder);
                        } else {
                            setError('Payment verification pending. Please check your orders page.');
                        }
                    } else {
                        setError('Unable to fetch order details');
                    }
                } catch (err) {
                    setError('Unable to verify payment. Please check your orders page.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                        <Skeleton className="h-6 w-48 mx-auto mt-4" />
                        <Skeleton className="h-4 w-64 mx-auto mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <Card className="w-full max-w-md border-orange-200 bg-orange-50">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <CardTitle className="mt-4">Payment Processing</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" onClick={() => navigate('/orders')}>
                            View My Orders
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/">Return Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-20 flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="mt-6 text-2xl">Payment Successful!</CardTitle>
                    <CardDescription>
                        Your order has been confirmed and is being processed
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Order Summary */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-mono text-sm">{order?._id?.slice(-8).toUpperCase()}</span>
                        </div>

                        {order && (
                            <>
                                <div className="flex justify-between items-center pb-4 border-b">
                                    <span className="text-muted-foreground">Order Status</span>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        {order.orderStatus}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center pb-4 border-b">
                                    <span className="text-muted-foreground">Payment Status</span>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        {order.paymentStatus}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${order.subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>${order.taxAmount?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t">
                                        <span>Total Paid</span>
                                        <span className="text-green-600">${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                {order.items && order.items.length > 0 && (
                                    <div className="pt-4">
                                        <p className="text-sm font-medium mb-2">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in this order
                                        </p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {item.quantity}x {item.size && `Size ${item.size}`}
                                                    </span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <p className="text-xs text-muted-foreground">
                                                    +{order.items.length - 3} more items
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={() => navigate('/orders')}>
                        <Package className="mr-2 h-4 w-4" />
                        Track Your Order
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
