// Task object
export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string; // ISO string
    createdAt: string;
    updatedAt: string;
    priority: 'Low' | 'Medium' | 'High';
}

// API response for a list of tasks
export interface TaskListResponse {
    tasks: Task[];
    total: number;
}

// API response for a single task
export interface TaskResponse {
    task: Task;
}

// API error response
export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

// Props for TaskList component
export interface TaskListProps {
    tasks: Task[];
}

// Props for TaskItem component
export interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

// Props for TaskForm component
export interface TaskFormProps {
    onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: Partial<Task>;
    loading?: boolean;
}

// State for TaskContext
export interface TaskState {
    tasks: Task[];
    loading: boolean;
    error?: string;
}