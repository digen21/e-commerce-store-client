import React from 'react';
import { useOrders } from './hooks/useOrders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const OrderHistory = () => {
    const { data: orders, isLoading } = useOrders();

    if (isLoading) {
        return <div className="container py-8 text-center">Loading orders...</div>;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">You have no past orders.</h2>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Order History</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Order Placed</p>
                                    <p className="font-semibold">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total</p>
                                    <p className="font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Order ID</p>
                                    <p className="font-semibold">#{order.id}</p>
                                </div>
                                <div>
                                    <Badge variant="default" className="text-xs px-3 py-1">Completed</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center sm:items-start p-4 hover:bg-accent/10 rounded-md transition-colors border-b last:border-0 border-dashed">
                                        <div className="flex gap-4">
                                            {item.imageUrl && (
                                                <div className="hidden sm:block">
                                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
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
        </div>
    );
};

export default OrderHistory;
