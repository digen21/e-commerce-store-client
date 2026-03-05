import { HelpCircle, Home, RefreshCcw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/services/api';

const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorReason, setErrorReason] = useState('payment_failed');

    useEffect(() => {
        const fetchFailedOrderDetails = async () => {
            if (!sessionId) {
                setErrorReason('no_session');
                setLoading(false);
                return;
            }

            try {
                // Try to fetch order details using the session ID
                const response = await api.get(`/orders/verify-payment?session_id=${sessionId}`);

                if (response.data.success) {
                    setOrder(response.data.data.order);
                    if (response.data.data.order.orderStatus === 'FAILED') {
                        setErrorReason('order_failed');
                    } else if (response.data.data.order.paymentStatus === 'FAILED') {
                        setErrorReason('payment_failed');
                    }
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                // Fallback: check recent orders
                try {
                    const ordersResponse = await api.get('/orders?limit=1');
                    if (ordersResponse.data.success && ordersResponse.data.data.length > 0) {
                        const latestOrder = ordersResponse.data.data[0];
                        setOrder(latestOrder);
                        if (latestOrder.orderStatus === 'FAILED' || latestOrder.paymentStatus === 'FAILED') {
                            setErrorReason('order_failed');
                        } else if (latestOrder.orderStatus === 'PENDING') {
                            setErrorReason('payment_pending');
                        }
                    }
                } catch (fallbackErr) {
                    setErrorReason('unknown');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFailedOrderDetails();
    }, [sessionId]);

    const getErrorMessage = () => {
        switch (errorReason) {
            case 'no_session':
                return {
                    title: 'No Payment Session',
                    description: 'We couldn\'t find any payment session. Please try again.',
                };
            case 'order_failed':
                return {
                    title: 'Order Failed',
                    description: 'Unfortunately, your order could not be processed. This might be due to inventory issues or pricing changes.',
                };
            case 'payment_failed':
                return {
                    title: 'Payment Failed',
                    description: 'Your payment could not be processed. This might be due to insufficient funds, card issues, or network problems.',
                };
            case 'payment_pending':
                return {
                    title: 'Payment Pending',
                    description: 'Your payment is still being processed. Please check your orders page for the latest status.',
                };
            default:
                return {
                    title: 'Transaction Failed',
                    description: 'Something went wrong with your transaction. Please try again.',
                };
        }
    };

    const errorInfo = getErrorMessage();

    if (loading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <RefreshCcw className="h-8 w-8 text-muted-foreground animate-spin" />
                        </div>
                        <CardTitle className="mt-6">Checking Payment Status...</CardTitle>
                        <CardDescription>
                            Please wait while we verify your payment
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-20 flex items-center justify-center">
            <Card className="w-full max-w-lg border-destructive/20">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <XCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="mt-6 text-2xl">{errorInfo.title}</CardTitle>
                    <CardDescription>{errorInfo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {order && (
                        <>
                            <Alert variant="destructive" className="bg-orange-50 border-orange-200">
                                <HelpCircle className="h-4 w-4" />
                                <AlertTitle>Order Reference</AlertTitle>
                                <AlertDescription className="mt-1">
                                    <span className="font-mono text-sm">{order._id?.slice(-8).toUpperCase()}</span>
                                </AlertDescription>
                            </Alert>

                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-muted-foreground">Order Status</span>
                                <span className="font-medium text-orange-600">{order.orderStatus}</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-muted-foreground">Payment Status</span>
                                <span className="font-medium text-orange-600">{order.paymentStatus}</span>
                            </div>

                            {order.totalAmount && (
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            )}
                        </>
                    )}

                    <Alert className="bg-blue-50 border-blue-200">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-900">Need Help?</AlertTitle>
                        <AlertDescription className="text-blue-700 mt-1">
                            If the amount was deducted from your account, it will be refunded within 5-7 business days.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={() => navigate('/checkout')}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
                        View My Orders
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentFailure;
