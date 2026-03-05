import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const LowStockWidget = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Low Stock Alert
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <Package className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">All products are well stocked!</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-orange-200 dark:border-orange-900">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Alert
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {products.length} product{products.length !== 1 ? 's' : ''} need attention
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {products.slice(0, 5).map((product) => {
                        // Handle API response format: { name, image, category, stockLeft, variants }
                        const imageUrl = product.image || product.images?.[0] || product.imageUrl;
                        const productName = product.name || product.title || 'Product';
                        const categoryName = product.category || 'Uncategorized';
                        const stockLeft = product.stockLeft ?? 0;
                        
                        return (
                            <div
                                key={product._id || product.id || productName}
                                className="flex items-center justify-between gap-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 p-3 transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/30"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <img
                                        src={imageUrl}
                                        alt={productName}
                                        className="h-12 w-12 rounded-md object-cover bg-muted"
                                        onError={(e) => {
                                            const target = e.target;
                                            if (target.dataset.fallback) return;
                                            target.dataset.fallback = 'true';
                                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect fill="%23ddd" width="50" height="50"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{productName}</p>
                                        <p className="text-xs text-muted-foreground">{categoryName}</p>
                                        {product.variants && product.variants.length > 0 && (
                                            <div className="flex gap-1 mt-1 flex-wrap">
                                                {product.variants.slice(0, 3).map((variant, idx) => (
                                                    <span key={variant._id || idx} className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                                                        {variant.size}: {variant.stock}
                                                    </span>
                                                ))}
                                                {product.variants.length > 3 && (
                                                    <span className="text-xs text-muted-foreground">+{product.variants.length - 3} more</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="secondary"
                                        className={
                                            stockLeft <= 0
                                                ? 'bg-red-500/10 text-red-500'
                                                : stockLeft <= 5
                                                ? 'bg-orange-500/10 text-orange-500'
                                                : 'bg-yellow-500/10 text-yellow-500'
                                        }
                                    >
                                        {stockLeft <= 0
                                            ? 'Out of Stock'
                                            : stockLeft <= 5
                                            ? `${stockLeft} left`
                                            : `Low: ${stockLeft}`}
                                    </Badge>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/admin/products`}>Restock</Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    {products.length > 5 && (
                        <Button variant="ghost" className="w-full" asChild>
                            <Link to="/admin/inventory">
                                View all {products.length} low stock products
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default LowStockWidget;
