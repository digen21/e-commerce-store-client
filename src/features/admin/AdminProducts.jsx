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
                            <TableHead>Inventory</TableHead>
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
                                const imageUrl = product.images?.[0] || product.imageUrl || 'https://via.placeholder.com/100x100?text=No+Image';
                                const stockQuantity = product.stock ?? product.stockQuantity ?? 0;

                                return (
                                    <TableRow key={product._id || product.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.title}
                                                    className="w-10 h-10 object-cover rounded-md bg-muted"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                                    }}
                                                />
                                                <span className="line-clamp-1 max-w-[200px]">{product.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {stockQuantity === 0 ? (
                                                <Badge variant="destructive">Out of Stock</Badge>
                                            ) : stockQuantity <= 5 ? (
                                                <Badge className="bg-orange-500 hover:bg-orange-600">{stockQuantity} Left</Badge>
                                            ) : (
                                                <Badge className="bg-green-600 hover:bg-green-700">{stockQuantity} In Stock</Badge>
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
