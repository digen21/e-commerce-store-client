import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: async (token) => {
            try {
                const { data } = await api.get('/auth/verify-email', { params: { token }, withCredentials: false });
                return data;
            } catch (error) {
                // Re-throw to let the component handle it
                throw error;
            }
        },
        retry: false,
    });
};
