import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProductMutations, useProducts } from '../products/hooks/useProducts';
import { ProductFormDialog } from './components/ProductFormDialog';

const AdminProducts = () => {
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data, isLoading, error, refetch } = useProducts({ page, limit });
    const { deleteProduct } = useProductMutations();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        if (error) {
            toast.error('Failed to load products');
        }
    }, [error]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct.mutateAsync(id);
                toast.success('Product deleted successfully');
                refetch();
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-lg border shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Products & Inventory</h2>
                    <p className="text-muted-foreground">Manage your product catalog and inventory levels.</p>
                </div>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Variants</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                                        <span>Loading products...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <div className="flex flex-col items-center gap-2 text-destructive">
                                        <p>Failed to load products</p>
                                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                                            Retry
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : !data?.products || data.products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-muted-foreground">No products found. Add your first product!</p>
                                        <Button onClick={handleAdd}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Product
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.products.map((product) => {
                                // Get first image from images array or use placeholder
                                const imageUrl = product.images?.[0] || product.imageUrl;
                                const variants = product.variants || [];

                                return (
                                    <TableRow key={product._id || product.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.title}
                                                    className="w-10 h-10 object-cover rounded-md bg-muted"
                                                    onError={(e) => {
                                                        const target = e.target;
                                                        if (target.dataset.fallback) return;
                                                        target.dataset.fallback = 'true';
                                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                                <span className="line-clamp-1 max-w-[200px]">{product.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {variants.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {variants.map((variant, idx) => (
                                                        <Badge
                                                            key={variant._id || idx}
                                                            variant="secondary"
                                                            className={variant.stock <= 0 ? 'bg-destructive/20 text-destructive' : variant.stock <= 5 ? 'bg-orange-500/20 text-orange-600' : 'bg-green-500/20 text-green-600'}
                                                        >
                                                            {variant.size}: {variant.stock}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Badge variant="outline">No Variants</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                                    <Edit className="w-4 h-4 hover:text-primary transition-colors" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id || product.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive hover:text-red-700 transition-colors" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {data?.pagination?.totalPages > 1 && (
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} products
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <span className="text-sm font-medium">
                            Page {page} of {data.pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= data.pagination.totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {isDialogOpen && (
                <ProductFormDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    product={editingProduct}
                />
            )}
        </div>
    );
};

export default AdminProducts;
