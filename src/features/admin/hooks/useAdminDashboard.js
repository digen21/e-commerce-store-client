import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { mockDashboardOverview, mockSalesTrends, mockMonthlySalesTrends, mockOrderStatusDistribution } from '@/services/mockAdminData';

// Use mock data - replace with actual API call when backend is ready
const USE_MOCK_DATA = true;

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                return mockDashboardOverview.data;
            }

            const { data } = await api.get('/api/admin/dashboard');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useSalesTrends = (period = 'weekly') => {
    return useQuery({
        queryKey: ['adminSalesTrends', period],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                // Return the correct mock data based on period
                const mockData = period === 'monthly' ? mockMonthlySalesTrends : mockSalesTrends;
                return { ...mockData.data, period };
            }

            const { data } = await api.get('/api/admin/analytics/sales-trends', {
                params: { period }
            });
            return data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useOrderStatusDistribution = () => {
    return useQuery({
        queryKey: ['adminOrderStatusDistribution'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return mockOrderStatusDistribution.data;
            }
            
            const { data } = await api.get('/api/admin/analytics/order-status-distribution');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
