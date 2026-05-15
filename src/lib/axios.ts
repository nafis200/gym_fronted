import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Check for Bearer token if it's already there or handle cases where it might be raw
            // For this project, we'll assume the cookie has the token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;