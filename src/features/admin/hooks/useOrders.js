import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { mockRecentOrders } from '@/services/mockAdminData';

const USE_MOCK_DATA = true;

export const useAdminOrders = (options = {}) => {
    const { page = 1, limit = 10, status = '', search = '' } = options;
    
    return useQuery({
        queryKey: ['adminOrders', { page, limit, status, search }],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                let orders = mockRecentOrders.data.orders;
                
                // Filter by status
                if (status) {
                    orders = orders.filter(o => o.orderStatus === status);
                }
                
                // Filter by search
                if (search) {
                    orders = orders.filter(o => 
                        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                        o.customer.email.toLowerCase().includes(search.toLowerCase())
                    );
                }
                
                return {
                    ...mockRecentOrders.data,
                    orders: orders.slice((page - 1) * limit, page * limit)
                };
            }
            
            const { data } = await api.get('/api/admin/orders', {
                params: { page, limit, status, search }
            });
            return data;
        },
        staleTime: 2 * 60 * 1000,
    });
};

export const useOrderDetails = (orderId) => {
    return useQuery({
        queryKey: ['adminOrderDetails', orderId],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const order = mockRecentOrders.data.orders.find(o => o._id === orderId);
                return order;
            }
            
            const { data } = await api.get(`/api/admin/orders/${orderId}`);
            return data;
        },
        enabled: !!orderId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ orderId, orderStatus }) => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, message: 'Order status updated successfully' };
            }
            
            const { data } = await api.put(`/api/orders/${orderId}/status`, { orderStatus });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            queryClient.invalidateQueries({ queryKey: ['adminOrderDetails'] });
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
        },
    });
};

export const useExportOrders = () => {
    return useMutation({
        mutationFn: async (filters = {}) => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, downloadUrl: '/downloads/orders-export.csv' };
            }
            
            const { data } = await api.get('/api/admin/orders/export', {
                params: filters,
                responseType: 'blob'
            });
            return data;
        },
    });
};
