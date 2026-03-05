import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import api from '@/services/api';

export const useOrders = (page = 1, limit = 10) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['orders', user?.id, page, limit],
        queryFn: async () => {
            // API endpoint: GET /api/orders?page=1&limit=10
            const { data } = await api.get('/orders', {
                params: { page, limit }
            });

            // API returns: { success, message, data: [...orders], pagination: {...}, status }
            return {
                orders: data.data || [],
                pagination: data.pagination || {
                    totalDocs: 0,
                    limit,
                    page,
                    totalPages: 1
                }
            };
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useInvoice = (orderId) => {
    return useQuery({
        queryKey: ['invoice', orderId],
        queryFn: async () => {
            const { data } = await api.get(`/payments/invoices/${orderId}`);
            return data.data;
        },
        enabled: !!orderId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useCheckout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderData) => {
            // Step 1: Create order
            const idempotencyKey = crypto.randomUUID();
            const createResponse = await api.post('/orders', orderData, {
                headers: {
                    'X-Idempotency-Key': idempotencyKey
                }
            });

            if (!createResponse.data.success) {
                throw new Error(createResponse.data.message || 'Failed to create order');
            }

            const orderId = createResponse.data.data.order._id;

            // Step 2: Initialize payment
            const paymentResponse = await api.post('/orders/init-payment', {
                orderId
            }, {
                headers: {
                    'x-idempotency-key': `payment-${idempotencyKey}`
                }
            });

            if (!paymentResponse.data.success) {
                throw new Error(paymentResponse.data.message || 'Failed to initialize payment');
            }

            return {
                order: createResponse.data.data.order,
                paymentUrl: paymentResponse.data.data.payment.paymentUrl
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId }) => {
            // API endpoint: POST /api/orders/:orderId/cancel
            const { data } = await api.post(`/orders/${orderId}/cancel`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    });
};
