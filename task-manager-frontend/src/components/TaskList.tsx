import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTask } from '../api/tasks';
import { Task, TaskListProps } from '../types/task';
import { fetchTasks } from '../api/tasks';

interface Filter {
  status: 'all' | 'completed' | 'pending';
  search: string;
  sort: 'date' | 'title';
  priority?: 'all' | 'Low' | 'Medium' | 'High';
}

const TaskList: React.FC<TaskListProps> = () => {
  const [filter, setFilter] = useState<Filter>({
    status: 'all',
    search: '',
    sort: 'date',
    priority: 'all',
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  // Delete handler with confirmation
  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (err) {
        window.alert('Failed to delete task.');
      }
    }
  };

  // Fetch all tasks on mount (initial search)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetchTasks();
        const rawTasks = Array.isArray(response) ? response : response.tasks;
        const mappedTasks = rawTasks.map((task: any) => ({
          ...task,
          createdAt: task.createdAt || task.created_at,
          updatedAt: task.updatedAt || task.updated_at,
        }));
        setTasks(mappedTasks);
      } catch (err) {
        setTasks([]);
      }
    };
    fetchAll();
  }, []);


  

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Filter['status'];
    setFilter((prev) => ({ ...prev, status: newStatus }));
    await fetchTasksWithFilter({ ...filter, status: newStatus });
  };

  const handleSortChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as Filter['sort'];
    setFilter((prev) => ({ ...prev, sort: newSort }));
    await fetchTasksWithFilter({ ...filter, sort: newSort });
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setFilter((prev) => ({ ...prev, search: newSearch }));
    await fetchTasksWithFilter({ ...filter, search: newSearch });
  };

  // Helper to call API with filter/sort/search
  const fetchTasksWithFilter = async (params: Partial<Filter>) => {
    try {
      // Adjust this to match your backend API (add query params as needed)
      const response = await fetchTasks();
      const rawTasks = Array.isArray(response) ? response : response.tasks;
      const mappedTasks = rawTasks.map((task: any) => ({
        ...task,
        createdAt: task.createdAt || task.created_at,
        updatedAt: task.updatedAt || task.updated_at,
      }));
      setTasks(mappedTasks);
    } catch (err) {
      // Handle error
    }
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (filter.status !== 'all') {
      filtered = filtered.filter((task) =>
        filter.status === 'completed' ? task.completed : !task.completed
      );
    }
    if (filter.search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filter.search.toLowerCase()))
      );
    }
    if (filter.sort === 'date') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filter.sort === 'title') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (filter.priority && filter.priority !== 'all') {
      filtered = filtered.filter((task) => task.priority === filter.priority);
}
    
    return filtered;
  }, [tasks, filter]);

  // Handler for adding a new task
  const handleAddTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    // You may want to call your API to add the task, then refresh the list
    // For now, just optimistic update (add to top)
    setTasks((prev) => [
      {
        ...task,
        id: Math.random().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

    return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded shadow-md">
      {/* <TaskForm onSubmit={handleAddTask} /> */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 mt-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filter.search}
          onChange={handleSearchChange}
          className="border rounded px-2 py-1 w-full md:w-1/3"
        />
        <select value={filter.status} onChange={handleStatusChange} className="border rounded px-2 py-1">
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <select
    value={filter.priority || 'all'}
    onChange={e => setFilter(prev => ({ ...prev, priority: e.target.value as any }))}
    className="border rounded px-2 py-1"
  >
    <option value="all">All Priorities</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
        <select value={filter.sort} onChange={handleSortChange} className="border rounded px-2 py-1">
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
      <ul className="divide-y divide-gray-200">
        <li className="flex font-bold text-gray-700 bg-gray-100 rounded-t px-2 py-2 text-sm md:text-base">
          <div className="flex-1">Title & Description</div>
          <div className="w-24 text-center">Status</div>
          <div className="w-24 text-center">Priority</div>
          <div className="w-32 text-center">Due Date</div>
          <div className="w-32 text-center">Created</div>
          <div className="w-32 text-center">Action</div>
        </li>
        {filteredTasks.length === 0 ? (
          <li className="py-4 text-center text-gray-500">No tasks found.</li>
        ) : (
          filteredTasks.map((task) => (
            <li key={task.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <span className={`font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</span>
                {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
              </div>
              <div className="w-24 flex items-center justify-center gap-2 mt-2 md:mt-0">
                <span className={`text-xs px-2 py-1 rounded ${task.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{task.completed ? 'Completed' : 'Pending'}</span>
              </div>
              <div className="w-24 flex items-center justify-center text-xs text-gray-700 mt-2 md:mt-0">
                {task.priority || '-'}
              </div>
              <div className="w-32 flex items-center justify-center text-xs text-gray-700 mt-2 md:mt-0">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
              </div>
              <div className="w-32 flex items-center justify-center text-xs text-gray-400 mt-2 md:mt-0">
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
              <div className="w-32 flex items-center justify-center gap-2 mt-2 md:mt-0">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => navigate(`/tasks/${task.id}/edit`)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;