// Function to fetch a single task by ID
export const getTask = async (taskId: string) => {
    const response = await axios.get(`${API_URL}/${taskId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};
import axios from 'axios';
import { getToken } from './tokenService';
import { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:4000/api/v1/tasks'; // Replace with your actual API URL

// Function to fetch all tasks
export const fetchTasks = async () => {
    console.log('Fetching tasks from:', API_URL);
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

// Function to create a new task

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string; // ISO string
    priority?: 'Low' | 'Medium' | 'High';
    [key: string]: any;
}


export interface CreateTaskData {
    title: string;
    description?: string;
    completed?: boolean;
    dueDate?: string; // ISO string
    priority?: 'Low' | 'Medium' | 'High';
    [key: string]: any;
}


export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    console.log('Token gotton', getToken());
    const response: AxiosResponse<Task> = await axios.post(API_URL, taskData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

// Function to update an existing task

export interface UpdateTaskData {
    title?: string;
    description?: string;
    completed?: boolean;
    dueDate?: string; // ISO string
    priority?: 'Low' | 'Medium' | 'High';
    [key: string]: any;
}

export const updateTask = async (
    taskId: string,
    taskData: UpdateTaskData
): Promise<Task> => {
    const response: AxiosResponse<Task> = await axios.put(`${API_URL}/${taskId}`, taskData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

// Function to delete a task
export interface DeleteTaskResponse {
    success: boolean;
    message?: string;
    [key: string]: any;
}

export const deleteTask = async (taskId: string): Promise<DeleteTaskResponse> => {
    const response: AxiosResponse<DeleteTaskResponse> = await axios.delete(`${API_URL}/${taskId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};