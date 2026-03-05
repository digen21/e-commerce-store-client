import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { mockRecentOrders } from '@/services/mockAdminData';

const USE_MOCK_DATA = false;

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
                    orders,
                    pagination: {
                        totalDocs: orders.length,
                        limit,
                        page,
                        totalPages: Math.ceil(orders.length / limit)
                    }
                };
            }

            // API endpoint: /api/orders/admin/all?page=1&limit=10
            const { data } = await api.get('/orders/admin/all', {
                params: { page, limit, ...(status && { status }), ...(search && { search }) }
            });

            // API returns: { success, message, data: [...orders], pagination: {...}, status }
            return {
                orders: data.data || [],
                pagination: data.pagination || {
                    totalDocs: 0,
                    limit,
                    page,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                    nextPage: null,
                    prevPage: null
                }
            };
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

            // API endpoint: /api/orders/admin/:orderId
            const { data } = await api.get(`/orders/admin/${orderId}`);
            return data.data || data;
        },
        enabled: !!orderId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, orderStatus, estimatedDeliveryDate, failedReason }) => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, message: 'Order status updated successfully' };
            }

            // Build request body with optional fields
            const requestBody = { orderStatus };
            if (estimatedDeliveryDate) {
                requestBody.estimatedDeliveryDate = estimatedDeliveryDate;
            }
            if (failedReason) {
                requestBody.failedReason = failedReason;
            }

            // API endpoint: /api/orders/:orderId/status
            const { data } = await api.put(`/orders/${orderId}/status`, requestBody);
            return data;
        },
        onSuccess: () => {
            // Invalidate all admin orders queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            queryClient.invalidateQueries({ queryKey: ['adminOrderDetails'] });
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
            // Also invalidate user orders queries if they exist
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, reason }) => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, message: 'Order cancelled successfully' };
            }

            // API endpoint: POST /api/orders/:orderId/cancel
            const { data } = await api.post(`/orders/${orderId}/cancel`, { reason });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
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
