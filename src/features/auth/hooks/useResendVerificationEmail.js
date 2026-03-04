import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

export const useResendVerificationEmail = () => {
    return useMutation({
        mutationFn: async (email) => {
            const { data } = await api.post('/auth/resend-verification-email', { email });
            return data;
        },
    });
};
