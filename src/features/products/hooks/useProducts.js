import api from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export const useProducts = (params = {}) => {
    // Transform params to match API expectations
    const apiParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
        ...(params.category && { category: params.category }),
        ...(params.sort && { sort: params.sort }),
    };

    return useQuery({
        queryKey: ['products', apiParams],
        queryFn: async () => {
            const { data } = await api.get('/products', { params: apiParams });
            // API returns { success: true, data: { docs: [...], pagination: {...} } }
            // Transform docs to products for consistent usage
            const apiData = data.data || data;
            return {
                products: apiData.docs || apiData.products || [],
                pagination: {
                    page: apiData.page,
                    limit: apiData.limit,
                    total: apiData.totalDocs || apiData.total,
                    totalPages: apiData.totalPages
                }
            };
        },
        keepPreviousData: true,
    });
};

export const useProduct = (id) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const { data } = await api.get(`/products/${id}`);
            return data.data || data;
        },
        enabled: !!id,
    });
};

export const useProductMutations = () => {
    const queryClient = useQueryClient();

    const addProduct = useMutation({
        mutationFn: async (product) => {
            const { data } = await api.post('/products', product);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error) => {
            // Error is handled in the component
            console.error('Add product error:', error);
        }
    });

    const updateProduct = useMutation({
        mutationFn: async ({ id, ...data }) => {
            const { data: updatedData } = await api.put(`/products/${id}`, data);
            return updatedData;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error) => {
            // Error is handled in the component
            console.error('Update product error:', error);
        }
    });

    const deleteProduct = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
    });

    return {
        addProduct,
        updateProduct,
        deleteProduct,
    };
};
