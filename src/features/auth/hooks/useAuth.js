import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

const getUser = async () => {
  try {
    const { data } = await api.get("/auth/profile", { withCredentials: true });
    return data.user || data.data?.user;
  } catch (error) {
    // Only return null for 401/403 (truly unauthorized)
    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }
    // For network errors, CORS errors, or server down - throw error to trigger retry
    // This keeps the user logged in (cached data) while server is temporarily unavailable
    throw error;
  }
};

export const useAuth = (enabled = true) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes - refetch after 5 min
    retry: (failureCount, error) => {
      // Retry on network errors, but not on 401/403
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000), // Exponential backoff
    enabled, // Only fetch when explicitly enabled
    // Don't refetch on window focus or reconnect (prevents blocking after registration)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Keep cached data even when there's an error
    placeholderData: (previousData) => previousData,
  });


  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      // Set the user data in cache immediately
      queryClient.setQueryData(["authUser"], data.user || data.data?.user);
      // Invalidate the query to force a refetch of profile from server
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post("/auth/register", userData);
      return data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
