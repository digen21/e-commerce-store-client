import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Required for cookie-based authentication
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor for debugging (optional - remove in production if not needed)
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only log actual errors, not network connectivity issues
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Network error - don't spam console, but still reject
            console.warn('Network Error: Server may be unavailable');
        } else {
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const checkHealth = async () => {
    const { data } = await api.get('/health');
    return data;
};

export default api;
