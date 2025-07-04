import { Response } from 'express';
import { TaskService } from '../services/TaskService';
import { AuthRequest } from '../middleware/auth';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // Map frontend fields to backend fields
    let { dueDate, priority, ...rest } = req.body;
    let due_date = dueDate;
    // Map priority string to priority_id (1=Low, 2=Medium, 3=High)
    let priority_id = undefined;
    if (priority) {
      if (priority === 'Low') priority_id = 1;
      else if (priority === 'Medium') priority_id = 2;
      else if (priority === 'High') priority_id = 3;
    }
    const task = await TaskService.createTask({ ...rest, user_id: userId, completed: false, due_date, priority_id });
    res.status(201).json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create task' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = parseInt(req.params.id, 10);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const task = await TaskService.getTask(taskId, userId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    // Map priority_id to priority string and due_date to dueDate for frontend
    const mappedTask = {
      ...task,
      dueDate: task.due_date,
      priority:
        task.priority_id === 1 ? 'Low' :
        task.priority_id === 2 ? 'Medium' :
        task.priority_id === 3 ? 'High' : undefined,
    };
    res.json({ task: mappedTask });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to get task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = parseInt(req.params.id, 10);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // Map frontend fields to backend fields
    let { dueDate, priority, ...rest } = req.body;
    let due_date = dueDate;
    // Map priority string to priority_id (1=Low, 2=Medium, 3=High)
    let priority_id = undefined;
    if (priority) {
      if (priority === 'Low') priority_id = 1;
      else if (priority === 'Medium') priority_id = 2;
      else if (priority === 'High') priority_id = 3;
    }
    const task = await TaskService.updateTask(taskId, userId, { ...rest, due_date, priority_id });
    if (!task) return res.status(404).json({ error: 'Task not found or not updated' });
    res.json({ task });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = parseInt(req.params.id, 10);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const deleted = await TaskService.deleteTask(taskId, userId);
    if (!deleted) return res.status(404).json({ error: 'Task not found or not deleted' });
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to delete task' });
  }
};

export const listTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const tasks = await TaskService.listTasks(userId, req.query);
    // Map priority_id to priority string and due_date to dueDate for frontend
    const mappedTasks = tasks.map((task: any) => ({
      ...task,
      dueDate: task.due_date,
      priority:
        task.priority_id === 1 ? 'Low' :
        task.priority_id === 2 ? 'Medium' :
        task.priority_id === 3 ? 'High' : undefined,
    }));
    res.json({ tasks: mappedTasks });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to list tasks' });
  }
};
