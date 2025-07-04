export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    token: string;
}