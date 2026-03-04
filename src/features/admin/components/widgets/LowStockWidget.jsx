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
                    {products.slice(0, 5).map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center justify-between gap-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 p-3 transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/30"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="h-12 w-12 rounded-md object-cover bg-muted"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{product.title}</p>
                                    <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="secondary"
                                    className={
                                        product.stockQuantity === 0
                                            ? 'bg-red-500/10 text-red-500'
                                            : 'bg-orange-500/10 text-orange-500'
                                    }
                                >
                                    {product.stockQuantity === 0
                                        ? 'Out of Stock'
                                        : `${product.stockQuantity} left`}
                                </Badge>
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/admin/products`}>Restock</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
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
