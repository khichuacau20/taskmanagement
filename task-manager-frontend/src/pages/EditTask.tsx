import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { updateTask, getTask } from '../api/tasks';
import { Task } from '../types/task';

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError('Task ID is missing');
        setLoading(false);
        return;
      }
      try {
        const response = await getTask(id);
        const found = response.task || response;
        setTask({
          ...found,
          createdAt: found.createdAt || found.created_at,
          updatedAt: found.updatedAt || found.updated_at,
        });
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Task not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (updated: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return;
    try {
      await updateTask(id, updated);
      navigate('/', { state: { updateSuccess: true } });
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;



if (error) {
  return (
    <div className="p-8 text-center text-red-500">
      {error}
      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/')}
        >
          Back to Task List
        </button>
      </div>
    </div>
  );
}
if (!task) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
      {success && (
        <div className="mb-4 text-center">
          <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded shadow">
            Update successfully!
          </div>
        </div>
      )}
      <TaskForm
        initialData={task}
        onSubmit={handleSubmit}
        loading={false}
      />
    
    </div>
  );
};

export default EditTask;
