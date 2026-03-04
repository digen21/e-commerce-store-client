import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

const getUser = async () => {
  console.log("[useAuth] Fetching profile...");
  try {
    const { data } = await api.get("/auth/profile", { withCredentials: true });
    console.log("[useAuth] Profile fetched:", data.user);
    return data.user;
  } catch (error) {
    console.log("[useAuth] Profile fetch failed:", error.message);
    // Return null for 401, CORS errors, or network errors
    // This allows the app to load normally for unauthenticated users
    return null;
  }
};

export const useAuth = (enabled = true) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getUser,
    staleTime: Infinity,
    retry: false,
    enabled, // Only fetch when explicitly enabled
    // Don't refetch on window focus or reconnect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Show cached data immediately while loading in background
    placeholderData: () => {
      const cached = queryClient.getQueryData(["authUser"]);
      console.log("[useAuth] placeholderData:", cached);
      return cached;
    },
  });

  console.log("[useAuth] user:", user, "isLoading:", isLoading);

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      // Set the user data in cache immediately
      queryClient.setQueryData(["authUser"], data.user);
      // Invalidate the query to force a refetch of profile from server
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post("/auth/register", userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data.user);
      // Invalidate the query to force a refetch of profile from server
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
