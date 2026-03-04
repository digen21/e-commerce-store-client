import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

export const useResetPassword = () => {
    return useMutation({
        mutationFn: async ({ token, password }) => {
            const { data } = await api.post('/auth/reset-password', { token, password });
            return data;
        },
    });
};
