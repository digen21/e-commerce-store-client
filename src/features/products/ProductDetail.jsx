import { ArrowLeft, Info, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { addToCart } from '../../store/uiSlice';
import { useProduct } from './hooks/useProducts';


const ProductDetail = () => {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useProduct(id);
    const dispatch = useDispatch();
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        if (!selectedVariant) {
            toast.error('Please select a size first');
            return;
        }

        // Only pass necessary fields to cart to avoid leaking objects
        dispatch(addToCart({
            _id: product._id || product.id,
            id: product._id || product.id,
            title: product.title,
            price: product.price,
            images: product.images,
            imageUrl: product.imageUrl,
            quantity,
            variant: selectedVariant._id,
            size: selectedVariant.size,
            stock: selectedVariant.stock
        }));
        toast.success(`${product.title} (Size ${selectedVariant.size}) added to cart!`);
        setSelectedVariant(null);
        setQuantity(1);
    };

    if (isLoading) {
        return (
            <div className="container py-8 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <Skeleton className="h-[500px] w-full rounded-xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Product not found.</h2>
                <Button asChild variant="outline">
                    <Link to="/products">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-5xl">
            <Button asChild variant="ghost" className="mb-6">
                <Link to="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shop
                </Link>
            </Button>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="relative rounded-xl overflow-hidden bg-muted group">
                    <img
                        src={product.images?.[0] || product.imageUrl}
                        alt={product.title}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            const target = e.target;
                            if (target.dataset.fallback) return;
                            target.dataset.fallback = 'true';
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500"%3E%3Crect fill="%23ddd" width="500" height="500"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{product.title}</h1>
                        <p className="text-2xl font-semibold mt-4 text-primary">${product.price.toFixed(2)}</p>
                    </div>

                    <div className="prose dark:prose-invert">
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Info className="h-4 w-4" />
                            Availability
                        </div>
                        {selectedVariant ? (
                            selectedVariant.stock > 0 ? (
                                <p className={`text-sm ${selectedVariant.stock <= 5 ? 'text-orange-500 font-bold' : 'text-green-600'}`}>
                                    {selectedVariant.stock <= 5 ? `Only ${selectedVariant.stock} items left in stock for Size ${selectedVariant.size}!` : `${selectedVariant.stock} items in stock for Size ${selectedVariant.size}`}
                                </p>
                            ) : (
                                <p className="text-sm text-destructive font-bold">This size is Out of Stock</p>
                            )
                        ) : product.stock > 0 ? (
                            <p className={`text-sm ${product.stock <= 5 ? 'text-orange-500 font-bold' : 'text-green-600'}`}>
                                {product.stock <= 5 ? `Only ${product.stock} items left in stock!` : 'In Stock'}
                            </p>
                        ) : (
                            <p className="text-sm text-destructive font-bold">Out of Stock</p>
                        )}
                    </div>

                    {/* Variants (Sizes) */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Info className="h-4 w-4" />
                                    Available Sizes
                                </div>
                                {selectedVariant && (
                                    <span className="text-xs text-muted-foreground">
                                        Selected: <span className="font-semibold text-primary">Size {selectedVariant.size}</span>
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => {
                                    const isOutOfStock = variant.stock <= 0;
                                    const isSelected = selectedVariant?._id === variant._id;

                                    return (
                                        <Button
                                            key={variant._id}
                                            variant={isSelected ? 'default' : isOutOfStock ? 'outline' : 'outline'}
                                            size="sm"
                                            disabled={isOutOfStock}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`relative text-sm px-4 py-2 ${isOutOfStock
                                                ? 'opacity-40 cursor-not-allowed bg-muted'
                                                : isSelected
                                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                    : 'hover:bg-primary hover:text-primary-foreground'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Size {variant.size}</span>
                                                {!isOutOfStock && (
                                                    <span className="text-xs opacity-70">({variant.stock} left)</span>
                                                )}
                                            </div>
                                            {isOutOfStock && (
                                                <span className="text-xs ml-1">- Out of Stock</span>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                            {!selectedVariant && (
                                <p className="text-xs text-orange-500 font-medium">
                                    * Please select a size before adding to cart
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <Button
                            size="lg"
                            className="flex-1 text-lg font-semibold"
                            disabled={product.stock === 0 || (product.variants && product.variants.length > 0 && !selectedVariant)}
                            onClick={handleAdd}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {!selectedVariant && product.variants && product.variants.length > 0
                                ? 'Select a Size First'
                                : product.stock === 0
                                    ? 'Out of Stock'
                                    : 'Add to Cart'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
