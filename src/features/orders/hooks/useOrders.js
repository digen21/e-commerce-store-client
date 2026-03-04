import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import api from '@/services/api';
import { mockOrders } from '@/services/mockData';

const USE_MOCK_DATA = true;

export const useOrders = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['orders', user?.id],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                // Return orders for the logged-in user (mock user id is '2')
                return mockOrders.filter(order => order.userId === user?.id);
            }

            const { data } = await api.get('/orders');
            return data;
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCheckout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderData) => {
            const { data } = await api.post('/orders', orderData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
    });
};
