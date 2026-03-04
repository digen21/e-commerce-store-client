import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart, removeFromCart, updateQuantity, clearCart } from '../../store/uiSlice';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useAuth } from '../auth/hooks/useAuth';
import { useCheckout } from '../orders/hooks/useOrders';
import { toast } from 'sonner';

export const CartSheet = () => {
    const { isCartOpen, cart } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const { user } = useAuth();
    const checkout = useCheckout();

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleUpdateQuantity = (id, newQuantity, currentStock) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(id));
        } else if (newQuantity <= currentStock) {
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        } else {
            toast.error('Not enough stock available');
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to checkout.');
            dispatch(toggleCart());
            return;
        }

        try {
            const orderData = {
                items: cart.map(i => ({
                    productId: i.id,
                    title: i.title,
                    price: i.price,
                    quantity: i.quantity,
                    imageUrl: i.imageUrl
                })),
                totalAmount
            };

            await checkout.mutateAsync(orderData);
            dispatch(clearCart());
            toast.success('Order placed successfully (Mock Stripe)!');
        } catch (err) {
            toast.error('Checkout failed');
        }
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={() => dispatch(toggleCart())}>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                    <SheetDescription>Review your items before checkout.</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                            <ShoppingCartIcon className="w-16 h-16 opacity-20" />
                            <p>Your cart is empty.</p>
                            <Button variant="outline" onClick={() => dispatch(toggleCart())}>Continue Shopping</Button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b pb-4">
                                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-md bg-muted" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0" onClick={() => dispatch(removeFromCart(item.id))}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</div>
                                        <div className="flex items-center gap-2 bg-muted/50 rounded-md">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.stockQuantity)}>
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.stockQuantity)}>
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <SheetFooter className="flex-col sm:flex-col gap-4 mt-auto pt-4 border-t">
                        <div className="flex justify-between text-lg font-bold w-full mb-4">
                            <span>Total:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <Button
                            className="w-full text-lg h-12"
                            onClick={handleCheckout}
                            disabled={checkout.isPending}
                        >
                            {checkout.isPending ? 'Processing...' : (
                                <>
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Checkout with Stripe
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};

const ShoppingCartIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
)
