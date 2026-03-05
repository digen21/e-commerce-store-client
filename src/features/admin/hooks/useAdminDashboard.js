import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

// Use mock data - set to false to use real API calls
const USE_MOCK_DATA = false;

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                return {
                    totalProducts: 0,
                    totalOrders: 0,
                    totalRevenue: 0,
                    conversionRate: 0,
                    metrics: {
                        productsChange: 0,
                        ordersChange: 0,
                        revenueChange: 0,
                        conversionChange: 0
                    }
                };
            }

            // API endpoint: /api/admin/analytics/dashboard-overview
            const { data } = await api.get('/admin/analytics/dashboard-overview');
            
            // API returns: { success, message, data: {...}, status }
            return data.data || {
                totalProducts: 0,
                totalOrders: 0,
                totalRevenue: 0,
                conversionRate: 0,
                metrics: {
                    productsChange: 0,
                    ordersChange: 0,
                    revenueChange: 0,
                    conversionChange: 0
                }
            };
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
                return { trends: [], summary: { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 } };
            }

            // API endpoint: /api/admin/analytics/sales-performance?period=weekly|monthly
            const { data } = await api.get('/admin/analytics/sales-performance', {
                params: { period }
            });

            // API returns: { success, message, data: { period, currency, trends, summary }, status }
            return data.data || {
                period,
                currency: 'INR',
                trends: [],
                summary: { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 }
            };
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
                return {
                    totalOrders: 0,
                    distribution: []
                };
            }

            // API endpoint: /api/admin/analytics/order-status-distribution
            const { data } = await api.get('/admin/analytics/order-status-distribution');

            // API returns: { success, message, data: { totalOrders, distribution: [...] }, status }
            return data.data || {
                totalOrders: 0,
                distribution: []
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
