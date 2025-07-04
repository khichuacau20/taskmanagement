import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/task';

  // CRUD operations with real API call
import { createTask, fetchTasks } from '../api/tasks';

export type TaskFilter = {
  status?: 'all' | 'completed' | 'pending';
  search?: string;
};

export type TaskSort = 'date' | 'title';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { assignedUserId: string }) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  filterTasks: (filter: TaskFilter) => void;
  sortTasks: (sortBy: TaskSort) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TaskFilter>({ status: 'all', search: '' });
  const [sort, setSort] = useState<TaskSort>('date');

  // Simulate fetching tasks from API
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTasks([]); // Replace with real API fetch
      setLoading(false);
    }, 500);
  }, []);

  // Filtering and sorting logic
  const getFilteredSortedTasks = () => {
    let filtered: Task[] = Array.isArray(tasks) ? tasks : [];
    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter((task) =>
        filter.status === 'completed' ? task.completed : !task.completed
      );
    }
    if (filter.search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(filter.search!.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filter.search!.toLowerCase()))
      );
    }
    if (sort === 'date') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'title') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    return filtered;
  };


  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { assignedUserId: string }) => {
    setLoading(true);
    setError('');
    try {
      const newTask = await createTask(task);
      setTasks((prev) => [{ ...newTask } as Task, ...prev]);
    } catch (err) {
      setError('Failed to add task');
    }
    setLoading(false);
  };

  // Fetch tasks from database on mount
  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch(() => setError('Failed to fetch tasks'))
      .finally(() => setLoading(false));
  }, []);

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    setError('');
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      )
    );
    // Simulate API call
    await new Promise((res) => setTimeout(res, 400));
    setLoading(false);
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError('');
    setTasks((prev) => prev.filter((task) => task.id !== id));
    // Simulate API call
    await new Promise((res) => setTimeout(res, 400));
    setLoading(false);
  };

  const filterTasks = (newFilter: TaskFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const sortTasks = (sortBy: TaskSort) => {
    setSort(sortBy);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: getFilteredSortedTasks(),
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        filterTasks,
        sortTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};