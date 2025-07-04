import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:4000', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;