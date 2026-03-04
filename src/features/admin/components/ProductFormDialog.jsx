import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useProductMutations } from '../../products/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

const PREDEFINED_CATEGORIES = ['Streetwear', 'Classic', 'Graphic', 'Premium'];

export const ProductFormDialog = ({ open, onOpenChange, product }) => {
    const { addProduct, updateProduct } = useProductMutations();
    const isEditing = !!product;
    const [imageInput, setImageInput] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: product?.title || product?.name || '',
            description: product?.description || '',
            price: product?.price || 0,
            stock: product?.stock || product?.stockQuantity || 0,
            images: product?.images || (product?.imageUrl ? [product.imageUrl] : []),
            category: product?.category || 'General',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Product title is required'),
            description: Yup.string().required('Description is required'),
            price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
            stock: Yup.number().integer().min(0, 'Stock cannot be negative').required('Stock is required'),
            images: Yup.array().min(1, 'At least one image is required'),
            category: Yup.string().required('Category is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const submitData = {
                    title: values.title,
                    description: values.description,
                    price: values.price,
                    category: values.category,
                    stock: values.stock,
                    images: values.images,
                };

                if (isEditing) {
                    await updateProduct.mutateAsync({ id: product._id || product.id, ...submitData });
                    toast.success('Product updated successfully!');
                } else {
                    await addProduct.mutateAsync(submitData);
                    toast.success('Product created successfully!');
                }
                onOpenChange(false);
            } catch (err) {
                let errorMessage = 'Failed to save product';
                
                // Handle validation errors from backend
                if (err?.response?.data?.errors) {
                    const errors = err.response.data.errors;
                    // Extract first error message
                    const firstErrorKey = Object.keys(errors)[0];
                    if (firstErrorKey) {
                        const errorValue = errors[firstErrorKey];
                        errorMessage = typeof errorValue === 'string' 
                            ? errorValue 
                            : (errorValue?.message || 'Validation failed');
                    }
                } else if (err?.response?.data?.message) {
                    errorMessage = typeof err.response.data.message === 'string' 
                        ? err.response.data.message 
                        : 'Failed to save product';
                } else if (err?.response?.data?.error) {
                    errorMessage = typeof err.response.data.error === 'string' 
                        ? err.response.data.error 
                        : 'Failed to save product';
                } else if (err?.message) {
                    errorMessage = err.message;
                }
                
                toast.error(errorMessage);
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleAddImage = () => {
        if (imageInput && imageInput.trim()) {
            formik.setFieldValue('images', [...formik.values.images, imageInput.trim()]);
            setImageInput('');
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = formik.values.images.filter((_, i) => i !== index);
        formik.setFieldValue('images', newImages);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddImage();
        }
    };

    const handleCategoryChange = (value) => {
        if (value === '__custom__') {
            setShowCustomCategory(true);
            setCustomCategory('');
        } else {
            setShowCustomCategory(false);
            formik.setFieldValue('category', value);
        }
    };

    const handleAddCustomCategory = () => {
        if (customCategory && customCategory.trim()) {
            formik.setFieldValue('category', customCategory.trim());
            setShowCustomCategory(false);
            setCustomCategory('');
        }
    };

    const handleCustomCategoryKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomCategory();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Make changes to the product here.' : 'Fill in the details for the new product.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                            id="title"
                            name="title"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            placeholder="Enter product title"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="text-red-500 text-xs">
                                {typeof formik.errors.title === 'string' ? formik.errors.title : 'Required'}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            placeholder="Enter product description"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-red-500 text-xs">
                                {typeof formik.errors.description === 'string' ? formik.errors.description : 'Required'}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.price}
                            />
                            {formik.touched.price && formik.errors.price && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.price === 'string' ? formik.errors.price : 'Required'}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.stock}
                            />
                            {formik.touched.stock && formik.errors.stock && (
                                <p className="text-red-500 text-xs">
                                    {typeof formik.errors.stock === 'string' ? formik.errors.stock : 'Required'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        {!showCustomCategory ? (
                            <>
                                <Select
                                    value={formik.values.category}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PREDEFINED_CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                        <SelectItem value="__custom__">+ Add Custom Category</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Selected: <span className="font-medium">
                                        {typeof formik.values.category === 'string' ? formik.values.category : 'Select a category'}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    id="customCategory"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    onKeyPress={handleCustomCategoryKeyPress}
                                    placeholder="Enter category name"
                                    className="flex-1"
                                    autoFocus
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleAddCustomCategory}
                                    disabled={!customCategory.trim()}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setShowCustomCategory(false);
                                        setCustomCategory('');
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        {formik.touched.category && formik.errors.category && (
                            <p className="text-red-500 text-xs">
                                {typeof formik.errors.category === 'string' ? formik.errors.category : 'Required'}
                            </p>
                        )}
                    </div>

                    {/* Images Section */}
                    <div className="grid gap-2">
                        <Label>Product Images</Label>
                        <div className="flex gap-2">
                            <Input
                                id="imageInput"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter image URL (https://...)"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddImage}
                                disabled={!imageInput.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {formik.touched.images && formik.errors.images && (
                            <p className="text-red-500 text-xs">
                                {typeof formik.errors.images === 'string' ? formik.errors.images : 'At least one image required'}
                            </p>
                        )}

                        {/* Image Preview List */}
                        {formik.values.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {formik.values.images.map((img, index) => (
                                    <div key={index} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
                                        <img
                                            src={img}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? 'Saving...' : 'Save Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
