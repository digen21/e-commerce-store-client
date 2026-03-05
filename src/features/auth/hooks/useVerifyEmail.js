import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: async (token) => {
            const { data } = await api.post('/auth/verify-mail', {}, {
                params: { token }
            });
            return data;
        },
        retry: false,
    });
};
