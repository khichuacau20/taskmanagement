import axios from 'axios';
import { getToken, setToken, removeToken } from './tokenService'; // Assume these functions manage token storage

const API_URL = 'http://localhost:4000'; // Replace with your API URL

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to handle user login
interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const response = await axiosClient.post<LoginResponse>('/api/auth/login', credentials);
        setToken(response.data.token); // Store the token
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error;
    }
};

// Function to handle user logout
export const logout = () => {
    removeToken(); // Remove the token
};

// Function to get the current user
export const getCurrentUser = async () => {
    try {
        const response = await axiosClient.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            throw (error as any).response.data;
        }
        throw error;
    }
};