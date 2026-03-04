import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { mockInventoryOverview, mockLowStockProducts } from '@/services/mockAdminData';

const USE_MOCK_DATA = true;

export const useInventoryOverview = () => {
    return useQuery({
        queryKey: ['adminInventoryOverview'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return mockInventoryOverview.data;
            }
            
            const { data } = await api.get('/api/admin/inventory/overview');
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useLowStockProducts = (threshold = 5) => {
    return useQuery({
        queryKey: ['adminLowStockProducts', threshold],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { ...mockLowStockProducts.data, threshold };
            }
            
            const { data } = await api.get('/api/admin/inventory/low-stock', {
                params: { threshold }
            });
            return data;
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
