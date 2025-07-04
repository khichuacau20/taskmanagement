import React, { useState, useEffect } from 'react';
import { Task, TaskFormProps } from '../types/task';

const priorities = ['Low', 'Medium', 'High'] as const;
type Priority = typeof priorities[number];

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, loading }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? initialData.dueDate.slice(0, 10) : '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'Medium');
  const [completed, setCompleted] = useState(initialData?.completed || false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setDueDate(initialData?.dueDate ? initialData.dueDate.slice(0, 10) : '');
    setPriority(initialData?.priority || 'Medium');
    setCompleted(initialData?.completed || false);
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (title.length > 100) newErrors.title = 'Title must be under 100 characters.';
    if (description.length > 500) newErrors.description = 'Description must be under 500 characters.';
    if (!dueDate) newErrors.dueDate = 'Due date is required.';
    else if (isNaN(Date.parse(dueDate))) newErrors.dueDate = 'Invalid date.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority,
      completed,
    });
    if (!initialData) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setCompleted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-4 bg-white rounded shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit Task' : 'Add New Task'}</h2>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Title<span className="text-red-500">*</span></label>
        <input
          type="text"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            if (errors.title) setErrors(prev => { const { title, ...rest } = prev; return rest; });
          }}
          className={`border rounded px-2 py-1 w-full ${errors.title ? 'border-red-500' : ''}`}
          maxLength={100}
          disabled={loading}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          value={description}
          onChange={e => {
            setDescription(e.target.value);
            if (errors.description) setErrors(prev => { const { description, ...rest } = prev; return rest; });
          }}
          className={`border rounded px-2 py-1 w-full ${errors.description ? 'border-red-500' : ''}`}
          maxLength={500}
          rows={3}
          disabled={loading}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Due Date<span className="text-red-500">*</span></label>
        <input
          type="date"
          value={dueDate}
          onChange={e => {
            setDueDate(e.target.value);
            if (errors.dueDate) setErrors(prev => { const { dueDate, ...rest } = prev; return rest; });
          }}
          className={`border rounded px-2 py-1 w-full ${errors.dueDate ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Priority</label>
        <select
          value={priority}
          onChange={e => {
            setPriority(e.target.value as Priority);
          }}
          className="border rounded px-2 py-1 w-full"
          disabled={loading}
        >
          {priorities.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Status</label>
        <select
          value={completed ? 'completed' : 'pending'}
          onChange={e => {
            setCompleted(e.target.value === 'completed');
          }}
          className="border rounded px-2 py-1 w-full"
          disabled={loading}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex gap-2 justify-start">
        <button
          type="submit"
          className={
            initialData
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-xs disabled:opacity-50'
              : 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
          }
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update Task' : 'Add Task'}
        </button>
        {initialData && (
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Back
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;