import { useState, useCallback } from 'react';
import apiClient from '../api/axiosClient';
import { Task } from '../types/task';

// Hook for fetching tasks
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  return { tasks, loading, error, fetchTasks };
}

// Hook for form state and validation
export function useForm<T>(initialValues: T, validate: (values: T) => Partial<Record<keyof T, string>>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return { values, errors, handleChange, handleSubmit, setValues, setErrors };
}

// Hook for optimistic state updates
export function useOptimisticList<T>(initial: T[] = []) {
  const [list, setList] = useState<T[]>(initial);

  const add = (item: T) => setList((prev) => [item, ...prev]);
  const update = (id: string, updates: Partial<T>) =>
    setList((prev) => prev.map((item: any) => (item.id === id ? { ...item, ...updates } : item)));
  const remove = (id: string) => setList((prev) => prev.filter((item: any) => item.id !== id));

  return { list, add, update, remove, setList };
}
