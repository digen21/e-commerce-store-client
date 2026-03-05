import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const USE_MOCK_DATA = false;

export const useInventoryOverview = () => {
    return useQuery({
        queryKey: ['adminInventoryOverview'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return {
                    totalProducts: 0,
                    totalStockValue: 0,
                    lowStockCount: 0,
                    outOfStockCount: 0,
                    inStockCount: 0,
                    categories: []
                };
            }

            // For now, calculate from products API
            const { data } = await api.get('/products', { params: { page: 1, limit: 1000 } });
            const products = data.data?.docs || [];
            
            const lowStockThreshold = 5;
            const inStockCount = products.filter(p => (p.stock || p.stockQuantity) > 0).length;
            const lowStockCount = products.filter(p => {
                const stock = p.stock || p.stockQuantity || 0;
                return stock > 0 && stock <= lowStockThreshold;
            }).length;
            const outOfStockCount = products.filter(p => (p.stock || p.stockQuantity) === 0).length;
            const totalStockValue = products.reduce((sum, p) => {
                return sum + ((p.stock || p.stockQuantity || 0) * (p.price || 0));
            }, 0);

            return {
                totalProducts: products.length,
                totalStockValue,
                lowStockCount,
                outOfStockCount,
                inStockCount,
                categories: []
            };
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useLowStockProducts = (limit = 10) => {
    return useQuery({
        queryKey: ['adminLowStockProducts', limit],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { products: [], total: 0, limit };
            }

            // API endpoint: /api/products/low-stock
            const { data } = await api.get('/products/low-stock');

            // API returns: { success, message, data: [...], status }
            // data is an array of products with: name, image, category, stockLeft, variants
            const products = data.data || [];
            
            return {
                products,
                total: products.length,
                limit
            };
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useAdjustStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, adjustment }) => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, message: 'Stock adjusted successfully' };
            }

            const { data } = await api.post(`/api/admin/inventory/${productId}/adjust`, adjustment);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminInventoryOverview'] });
            queryClient.invalidateQueries({ queryKey: ['adminLowStockProducts'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useRestockHistory = () => {
    return useQuery({
        queryKey: ['adminRestockHistory'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { history: [] }; // Empty for mock
            }

            const { data } = await api.get('/api/admin/inventory/restock-history');
            return data;
        },
        staleTime: 10 * 60 * 1000,
    });
};
