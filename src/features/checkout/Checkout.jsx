import { useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { clearCart } from '../../store/uiSlice';
import { useUserProfile, useUpdateUserProfile } from '../user/hooks/useUserProfile';
import { useCheckout } from '../orders/hooks/useOrders';
import AddressModal from './AddressModal';

const ITEMS_PER_PAGE = 3;

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.ui);
    const { data: userProfile, isLoading: profileLoading, refetch } = useUserProfile();
    const updateProfile = useUpdateUserProfile();
    const checkout = useCheckout();

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [cartPage, setCartPage] = useState(1);

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Get addresses from user profile
    const addresses = userProfile?.addresses || [];

    // Get selected address details
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

    // Calculate cart pagination
    const totalCartPages = Math.ceil(cart.length / ITEMS_PER_PAGE);
    const cartItemsOnCurrentPage = cart.slice(
        (cartPage - 1) * ITEMS_PER_PAGE,
        cartPage * ITEMS_PER_PAGE
    );

    const handleAddAddress = async (addressData) => {
        try {
            const newAddress = {
                fullName: addressData.fullName,
                phone: addressData.phone,
                addressLine1: addressData.addressLine1,
                addressLine2: addressData.addressLine2,
                city: addressData.city,
                state: addressData.state,
                postalCode: addressData.postalCode,
                country: addressData.country,
            };

            await updateProfile.mutateAsync({ addresses: [...addresses, newAddress] });

            await refetch();

            toast.success('Address added successfully!');
            setIsAddressModalOpen(false);
        } catch (error) {
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'Failed to add address';
            toast.error(errorMessage);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            const addressId = selectedAddressId;

            if (!addressId) {
                toast.error('Please select or add an address first');
                return;
            }

            // Build order payload matching API expectations
            const orderData = {
                items: cart.map(item => {
                    const orderItem = {
                        product: item._id || item.id || item.product,
                        quantity: item.quantity,
                    };
                    // Include variant and size if they exist
                    if (item.variant) {
                        orderItem.variant = item.variant;
                    }
                    if (item.size) {
                        orderItem.size = item.size;
                    }
                    return orderItem;
                }),
                address: addressId
            };

            // Call checkout which creates order and initializes payment
            const response = await checkout.mutateAsync(orderData);

            // Clear cart before redirect
            dispatch(clearCart());

            // Redirect to Stripe payment URL
            if (response?.paymentUrl) {
                window.location.href = response.paymentUrl;
            } else {
                toast.success('Order placed successfully! Redirecting to payment...');
                navigate('/orders');
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'Failed to place order';
            toast.error(errorMessage);
        }
    };

    const handleSelectAddress = (addressId) => {
        setSelectedAddressId(addressId);
    };

    if (profileLoading) {
        return (
            <div className="container py-8">
                <div className="space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-40" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton key={i} className="h-24 w-full" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-40" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-32 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Address Section - Scrollable */}
                <div className="lg:col-span-2">
                    <Card className="h-[calc(100vh-200px)] flex flex-col">
                        <CardHeader className="shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <CardTitle>Shipping Address</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Select an address or add a new one
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => setIsAddressModalOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Address
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-3 px-6">
                            {addresses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                                    <Button onClick={() => setIsAddressModalOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Address
                                    </Button>
                                </div>
                            ) : (
                                addresses.map((address, index) => (
                                    <div
                                        key={address._id || index}
                                        className={`flex items-start justify-between gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${selectedAddressId === address._id
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:bg-muted/50'
                                            }`}
                                        onClick={() => handleSelectAddress(address._id)}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold">{address.fullName}</p>
                                                {selectedAddressId === address._id && (
                                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                                            {address.addressLine2 && (
                                                <p className="text-sm text-muted-foreground">{address.addressLine2}</p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                {address.city}, {address.state} {address.postalCode}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{address.country}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary - Fixed height with internal scrolling */}
                <div className="lg:col-span-1">
                    <Card className="h-[calc(100vh-200px)] flex flex-col sticky top-8">
                        <CardHeader className="shrink-0">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                <CardTitle>Order Summary</CardTitle>
                            </div>
                        </CardHeader>

                        {/* Selected Address */}
                        {selectedAddress && (
                            <div className="px-6 pb-4 border-b shrink-0">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold mb-1">Shipping to:</p>
                                        <p className="text-sm font-medium truncate">{selectedAddress.fullName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{selectedAddress.addressLine1}</p>
                                        {selectedAddress.addressLine2 && (
                                            <p className="text-xs text-muted-foreground truncate">{selectedAddress.addressLine2}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{selectedAddress.country}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{selectedAddress.phone}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scrollable Cart Items */}
                        <CardContent className="flex-1 overflow-y-auto space-y-3 px-6 py-4 min-h-0">
                            {cartItemsOnCurrentPage.map((item) => {
                                const imageUrl = item.images?.[0] || item.imageUrl || 'https://via.placeholder.com/60x60?text=No+Image';
                                const displayKey = item.variant ? `${item.id}-${item.variant}` : item.id;

                                return (
                                    <div key={displayKey} className="flex justify-between items-start gap-3 pb-3 border-b last:border-0">
                                        <div className="flex gap-3 flex-1 min-w-0">
                                            <img
                                                src={imageUrl}
                                                alt={item.title}
                                                className="w-14 h-14 object-cover rounded-md bg-muted shrink-0"
                                                onError={(e) => {
                                                    const target = e.target;
                                                    if (target.dataset.fallback) return;
                                                    target.dataset.fallback = 'true';
                                                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23ddd" width="60" height="60"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {item.title && typeof item.title === 'string' ? item.title : (item.productTitle || 'Product')}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                                    {item.size && typeof item.size === 'string' && (
                                                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                                            Size {item.size}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>

                        {/* Cart Pagination */}
                        {totalCartPages > 1 && (
                            <div className="px-6 pb-4 shrink-0">
                                <div className="flex items-center justify-between gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={cartPage <= 1}
                                        onClick={() => setCartPage(cartPage - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {cartPage} of {totalCartPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={cartPage >= totalCartPages}
                                        onClick={() => setCartPage(cartPage + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Total and Checkout Button */}
                        <div className="border-t p-6 space-y-3 shrink-0">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total ({cart.length} items)</span>
                                <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full h-12"
                                onClick={handlePlaceOrder}
                                disabled={checkout.isPending || addresses.length === 0 || !selectedAddressId}
                            >
                                {checkout.isPending ? 'Processing...' : (
                                    <>
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Place Order
                                    </>
                                )}
                            </Button>
                            {!selectedAddressId && addresses.length > 0 && (
                                <p className="text-xs text-orange-500 text-center">
                                    * Please select a shipping address
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Address Modal */}
            <AddressModal
                open={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSubmit={handleAddAddress}
                isPending={updateProfile.isPending}
            />
        </div>
    );
};

export default Checkout;
