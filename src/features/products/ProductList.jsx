import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/uiSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Streetwear', 'Classic', 'Graphic', 'Premium'];
const SORT_OPTIONS = [
    { label: 'Sort by', value: 'default' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
];

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';

    const [searchInput, setSearchInput] = useState(search);

    const { data, isLoading } = useProducts({ page, search, category, sort });

    const updateParams = (newParams) => {
        const params = Object.fromEntries(searchParams.entries());
        Object.assign(params, newParams);

        // Cleanup empty params
        Object.keys(params).forEach(key => {
            if (!params[key] || params[key] === 'All' || params[key] === 'default') {
                delete params[key];
            }
        });

        // Reset to page 1 on filter/sort changes
        if (!newParams.page && params.page) {
            params.page = '1';
        }

        setSearchParams(params);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateParams({ search: searchInput });
    };

    const handleAddToCart = (product) => {
        // Only pass necessary fields to cart to avoid leaking objects
        dispatch(addToCart({
            _id: product._id || product.id,
            id: product._id || product.id,
            title: product.title,
            price: product.price,
            images: product.images,
            imageUrl: product.imageUrl,
            stock: product.stock ?? product.stockQuantity,
            stockQuantity: product.stock ?? product.stockQuantity,
        }));
        toast.success(`${product.title} added to cart!`);
    };

    return (
        <div className="container py-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>

                {/* Filters and Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-1/3">
                        <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <div className="flex gap-4 w-full md:w-auto">
                        <Select
                            value={category || 'All'}
                            onValueChange={(val) => updateParams({ category: val })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={sort || 'default'}
                            onValueChange={(val) => updateParams({ sort: val })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                {SORT_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[250px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {data?.products?.length === 0 ? (
                        <div className="py-20 text-center text-muted-foreground">
                            No products found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {data?.products?.map((product) => {
                                // Get first image from images array or use placeholder
                                const imageUrl = product.images?.[0] || product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image';

                                // Calculate total stock from variants if they exist, otherwise use product.stock
                                const hasVariants = product.variants && product.variants.length > 0;
                                const stockQuantity = hasVariants
                                    ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
                                    : (product.stock ?? product.stockQuantity ?? 0);

                                return (
                                    <Card key={product._id || product.id} className="flex flex-col overflow-hidden">
                                        <Link to={`/products/${product._id || product.id}`} className="block relative group overflow-hidden">
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    const target = e.target;
                                                    if (target.dataset.fallback) return;
                                                    target.dataset.fallback = 'true';
                                                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                            {hasVariants && stockQuantity > 0 && stockQuantity <= 5 && (
                                                <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    Low Stock
                                                </span>
                                            )}
                                            {!hasVariants && stockQuantity <= 5 && stockQuantity > 0 && (
                                                <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    Low Stock
                                                </span>
                                            )}
                                            {stockQuantity === 0 && (
                                                <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </Link>
                                        <CardHeader className="p-4 pt-4">
                                            <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                                            <CardDescription className="text-primary font-bold">${product.price.toFixed(2)}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="px-4 py-0 flex-1">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {product.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {stockQuantity === 0
                                                    ? 'Out of Stock'
                                                    : `${stockQuantity} ${stockQuantity === 1 ? 'item' : 'items'} available`}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="p-4">
                                            <Button
                                                className="w-full"
                                                disabled={stockQuantity === 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // If product has variants, ALWAYS redirect to product detail page
                                                    if (product.variants && product.variants.length > 0) {
                                                        navigate(`/products/${product._id || product.id}`);
                                                    } else {
                                                        handleAddToCart(product);
                                                    }
                                                }}
                                            >
                                                {stockQuantity === 0 ? 'Out of Stock' : (product.variants && product.variants.length > 0 ? 'Select Options' : 'Add to Cart')}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {data?.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                disabled={page <= 1}
                                onClick={() => updateParams({ page: (page - 1).toString() })}
                            >
                                Previous
                            </Button>
                            <span className="text-sm font-medium">
                                Page {page} of {data.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page >= data.totalPages}
                                onClick={() => updateParams({ page: (page + 1).toString() })}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;
