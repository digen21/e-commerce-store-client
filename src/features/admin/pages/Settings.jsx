import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Store, Mail, Phone, MapPin, CreditCard, Bell, Palette, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminProfile, useUpdateAdminProfile } from '../hooks/useAdminProfile';
import { Skeleton } from '@/components/ui/skeleton';

const AdminSettings = () => {
    const { data: profile, isLoading } = useAdminProfile();
    const updateProfile = useUpdateAdminProfile();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            storeName: profile?.data?.storeName || profile?.storeName || '',
            email: profile?.data?.email || profile?.email || '',
            phone: profile?.data?.phone || profile?.phone || '',
            gstn: profile?.data?.gstn || profile?.gstn || '',
            addressLine1: profile?.data?.address?.addressLine1 || profile?.address?.addressLine1 || '',
            city: profile?.data?.address?.city || profile?.address?.city || '',
            state: profile?.data?.address?.state || profile?.address?.state || '',
            postalCode: profile?.data?.address?.postalCode || profile?.address?.postalCode || '',
            country: profile?.data?.address?.country || profile?.address?.country || '',
            taxRate: profile?.data?.taxRate || profile?.taxRate || 18,
            lowStockThreshold: profile?.data?.lowStockThreshold || profile?.lowStockThreshold || 5,
            currency: profile?.data?.currency || profile?.currency || 'INR',
            emailNotifications: profile?.data?.emailNotifications || profile?.emailNotifications || {
                newOrder: false,
                lowStock: false,
                orderShipped: false,
            },
        },
        validationSchema: Yup.object({
            storeName: Yup.string().required('Store name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            gstn: Yup.string()
                .uppercase()
                .min(15, 'GSTN must be at least 15 characters')
                .max(15, 'GSTN must be at most 15 characters')
                .matches(/^[0-9A-Z]+$/, 'GSTN must contain only alphanumeric characters')
                .nullable(),
            addressLine1: Yup.string().required('Address is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            postalCode: Yup.string().required('Postal code is required'),
            country: Yup.string().required('Country is required'),
            taxRate: Yup.number().min(0).max(100).required('Tax rate is required'),
            lowStockThreshold: Yup.number().min(0).required('Low stock threshold is required'),
        }),
        onSubmit: async (values) => {
            try {
                const updateData = {
                    storeName: values.storeName,
                    email: values.email,
                    phone: values.phone,
                    taxRate: values.taxRate,
                    address: {
                        addressLine1: values.addressLine1,
                        city: values.city,
                        state: values.state,
                        postalCode: values.postalCode,
                        country: values.country,
                    },
                };

                await updateProfile.mutateAsync(updateData);
                toast.success('Store settings updated successfully!');
            } catch (error) {
                console.error('Settings update error:', error);
                
                let errorMessage = 'Failed to update settings';
                
                if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error?.response?.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error?.response?.status === 404) {
                    errorMessage = 'Admin profile not found. Please contact support.';
                } else if (error?.response?.status === 401) {
                    errorMessage = 'Please login again to continue.';
                } else if (error?.message) {
                    errorMessage = error.message;
                }
                
                toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to update settings');
            }
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your store configuration</p>
            </div>

            {/* Store Information */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        <CardTitle>Store Information</CardTitle>
                    </div>
                    <CardDescription>Basic details about your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                name="storeName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.storeName}
                            />
                            {formik.touched.storeName && formik.errors.storeName && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.storeName === 'string' ? formik.errors.storeName : 'Required'}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Store Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.email === 'string' ? formik.errors.email : 'Required'}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Store Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.phone === 'string' ? formik.errors.phone : 'Required'}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gstn">GSTN (GST Identification Number) - Optional</Label>
                            <Input
                                id="gstn"
                                name="gstn"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.gstn?.toUpperCase() || ''}
                                placeholder="27AABCU9603R1ZM (optional)"
                                className="uppercase"
                            />
                            {formik.touched.gstn && formik.errors.gstn && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.gstn === 'string' ? formik.errors.gstn : ''}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Input id="currency" name="currency" value={formik.values.currency} disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="addressLine1">Address Line 1</Label>
                                <Input
                                    id="addressLine1"
                                    name="addressLine1"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.addressLine1}
                                />
                                {formik.touched.addressLine1 && formik.errors.addressLine1 && (
                                    <p className="text-red-500 text-xs">
                                        {typeof formik.errors.addressLine1 === 'string' ? formik.errors.addressLine1 : 'Required'}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.city}
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <p className="text-red-500 text-xs">
                                        {typeof formik.errors.city === 'string' ? formik.errors.city : 'Required'}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.state}
                                />
                                {formik.touched.state && formik.errors.state && (
                                    <p className="text-red-500 text-xs">
                                        {typeof formik.errors.state === 'string' ? formik.errors.state : 'Required'}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.postalCode}
                                />
                                {formik.touched.postalCode && formik.errors.postalCode && (
                                    <p className="text-red-500 text-xs">
                                        {typeof formik.errors.postalCode === 'string' ? formik.errors.postalCode : 'Required'}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.country}
                                />
                                {formik.touched.country && formik.errors.country && (
                                    <p className="text-red-500 text-xs">
                                        {typeof formik.errors.country === 'string' ? formik.errors.country : 'Required'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button 
                        type="submit" 
                        disabled={updateProfile.isPending || formik.isSubmitting}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfile.isPending || formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardContent>
            </Card>

            {/* Tax & Pricing */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <CardTitle>Tax & Pricing</CardTitle>
                    </div>
                    <CardDescription>Configure tax rates and pricing settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="taxRate">Tax Rate (%)</Label>
                            <Input
                                id="taxRate"
                                name="taxRate"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.taxRate}
                            />
                            {formik.touched.taxRate && formik.errors.taxRate && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.taxRate === 'string' ? formik.errors.taxRate : 'Required'}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                            <Input
                                id="lowStockThreshold"
                                name="lowStockThreshold"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lowStockThreshold}
                            />
                            {formik.touched.lowStockThreshold && formik.errors.lowStockThreshold && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.lowStockThreshold === 'string' ? formik.errors.lowStockThreshold : 'Required'}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button 
                        type="submit" 
                        disabled={updateProfile.isPending || formik.isSubmitting}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfile.isPending || formik.isSubmitting ? 'Saving...' : 'Save Settings'}
                    </Button>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>Configure email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>New Orders</Label>
                            <p className="text-sm text-muted-foreground">Receive email when a new order is placed</p>
                        </div>
                        <Switch
                            checked={formik.values.emailNotifications.newOrder}
                            onCheckedChange={(checked) => formik.setFieldValue('emailNotifications.newOrder', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Low Stock Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified when products are low on stock</p>
                        </div>
                        <Switch
                            checked={formik.values.emailNotifications.lowStock}
                            onCheckedChange={(checked) => formik.setFieldValue('emailNotifications.lowStock', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Order Shipped</Label>
                            <p className="text-sm text-muted-foreground">Notify customers when their order ships</p>
                        </div>
                        <Switch
                            checked={formik.values.emailNotifications.orderShipped}
                            onCheckedChange={(checked) => formik.setFieldValue('emailNotifications.orderShipped', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>Customize the look and feel of your admin panel</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Theme settings will be available soon.
                    </p>
                </CardContent>
            </Card>
        </form>
    );
};

export default AdminSettings;
