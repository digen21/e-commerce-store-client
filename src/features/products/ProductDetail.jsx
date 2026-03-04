import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from './hooks/useProducts';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/uiSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingCart, Info } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useProduct(id);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        dispatch(addToCart({ ...product, quantity }));
        toast.success(`${product.title} added to cart!`);
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
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
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
                        {product.stockQuantity > 0 ? (
                            <p className={`text-sm ${product.stockQuantity <= 5 ? 'text-orange-500 font-bold' : 'text-green-600'}`}>
                                {product.stockQuantity <= 5 ? `Only ${product.stockQuantity} items left in stock!` : 'In Stock'}
                            </p>
                        ) : (
                            <p className="text-sm text-destructive font-bold">Out of Stock</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <Button
                            size="lg"
                            className="flex-1 text-lg font-semibold"
                            disabled={product.stockQuantity === 0}
                            onClick={handleAdd}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
