import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const AddressModal = ({ open, onClose, onSubmit, isPending }) => {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            phone: Yup.string().required('Phone number is required'),
            addressLine1: Yup.string().required('Address is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            postalCode: Yup.string().required('Postal code is required'),
            country: Yup.string().required('Country is required'),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                        Enter your shipping address details below
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.fullName}
                                />
                                {formik.touched.fullName && formik.errors.fullName && (
                                    <p className="text-red-500 text-xs">
                                        {typeof formik.errors.fullName === 'string' ? formik.errors.fullName : String(formik.errors.fullName?.message || 'Required')}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <p className="text-red-500 text-xs">
                                        {typeof formik.errors.phone === 'string' ? formik.errors.phone : String(formik.errors.phone?.message || 'Required')}
                                    </p>
                                )}
                            </div>
                        </div>

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
                                    {typeof formik.errors.addressLine1 === 'string' ? formik.errors.addressLine1 : String(formik.errors.addressLine1?.message || 'Required')}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                            <Input
                                id="addressLine2"
                                name="addressLine2"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.addressLine2}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
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
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
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
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Address'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddressModal;
