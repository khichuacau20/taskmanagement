import axios from 'axios';
import { getToken } from './tokenService';

const axiosClient = axios.create({
    baseURL: 'http://localhost:4000', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authentication token
axiosClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific error responses
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized access (e.g., redirect to login)
                    break;
                case 404:
                    // Handle not found
                    break;
                // Add more cases as needed
                default:
                    break;
            }
        } else {
            // Handle network errors or other issues
        }
        return Promise.reject(error);
    }
);

export default axiosClient;