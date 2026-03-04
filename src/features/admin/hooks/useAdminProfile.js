import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// Real API calls - backend is ready
const USE_MOCK_DATA = false;

const mockAdminProfile = {
    success: true,
    data: {
        _id: '69a6cb4386927cac2b08b250',
        name: 'Admin User',
        email: 'admin@threadcraft.com',
        role: 'ADMIN',
        storeName: 'ThreadCraft',
        phone: '+91 9876543210',
        gstn: '27AABCU9603R1ZM',
        address: {
            addressLine1: '123 Business Park',
            addressLine2: '',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India'
        },
        taxRate: 18,
        currency: 'INR',
        lowStockThreshold: 5,
        emailNotifications: {
            newOrder: true,
            lowStock: true,
            orderShipped: true
        },
        createdAt: '2024-01-15T08:30:00.000Z',
        updatedAt: '2024-03-03T10:30:00.000Z'
    }
};

export const useAdminProfile = () => {
    return useQuery({
        queryKey: ['adminProfile'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return mockAdminProfile.data;
            }

            const { data } = await api.get('/admin/profile');
            // API returns { success: true, data: {...} }, so we return data.data
            return data.data || data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useUpdateAdminProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profileData) => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, message: 'Profile updated successfully' };
            }

            const { data } = await api.put('/admin/profile', profileData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminProfile'] });
        },
    });
};
