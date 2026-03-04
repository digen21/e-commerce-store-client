import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Must be true for cookie-based auth
    headers: {
        'Content-Type': 'application/json',
    },
});

// For local testing without proper CORS, temporarily set to false
// But backend MUST fix CORS for production cookie-based auth to work

export const checkHealth = async () => {
    const { data } = await api.get('/health');
    return data;
};

export default api;
