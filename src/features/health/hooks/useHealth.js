import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export const useHealth = () => {
    return useQuery({
        queryKey: ['health'],
        queryFn: async () => {
            const { data } = await api.get('/health');
            return data;
        },
        retry: false,
        staleTime: 60 * 1000, // 1 minute
    });
};
