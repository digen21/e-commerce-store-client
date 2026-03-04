import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (email) => {
            const { data } = await api.post('/auth/forgot-password', { email });
            return data;
        },
    });
};
