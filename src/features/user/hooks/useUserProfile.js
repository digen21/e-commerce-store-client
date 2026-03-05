import api from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const USE_MOCK_DATA = false;

export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return {
                    _id: '69a8733b23a6070b49c6bd29',
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'USER',
                    addresses: []
                };
            }

            const { data } = await api.get('/users/me');
            // API returns: { success, message, data: { user: {...}, details: { addresses: [...] } }, status }
            const userData = data.data || data;
            return {
                ...userData.user,
                addresses: userData.details?.addresses || []
            };
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profileData) => {
            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, message: 'Profile updated successfully' };
            }

            // API endpoint: PUT /api/users/me
            const { data } = await api.put('/users/me', profileData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
    });
};
