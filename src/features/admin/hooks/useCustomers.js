import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { mockCustomers, mockTopProducts } from '@/services/mockAdminData';

const USE_MOCK_DATA = true;

export const useCustomers = (options = {}) => {
    const { page = 1, limit = 10, search = '' } = options;
    
    return useQuery({
        queryKey: ['adminCustomers', { page, limit, search }],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                // Filter mock data based on search
                let customers = mockCustomers.data.customers;
                if (search) {
                    customers = customers.filter(c => 
                        c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.email.toLowerCase().includes(search.toLowerCase())
                    );
                }
                return {
                    ...mockCustomers.data,
                    customers: customers.slice((page - 1) * limit, page * limit)
                };
            }
            
            const { data } = await api.get('/api/admin/customers', {
                params: { page, limit, search }
            });
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useCustomerDetails = (customerId) => {
    return useQuery({
        queryKey: ['adminCustomerDetails', customerId],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const customer = mockCustomers.data.customers.find(c => c._id === customerId);
                return customer;
            }
            
            const { data } = await api.get(`/api/admin/customers/${customerId}`);
            return data;
        },
        enabled: !!customerId,
        staleTime: 10 * 60 * 1000,
    });
};

export const useTopProducts = (period = 'monthly') => {
    return useQuery({
        queryKey: ['adminTopProducts', period],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { ...mockTopProducts.data, period };
            }
            
            const { data } = await api.get('/api/admin/analytics/top-products', {
                params: { period }
            });
            return data;
        },
        staleTime: 15 * 60 * 1000,
    });
};
