import { TaskRepository } from '../repositories/TaskRepository';
import { Task } from '../models/Task';

export class TaskService {
  static async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    TaskService.validateTask(taskData);
    return TaskRepository.create(taskData);
  }

  static async getTask(id: number, user_id: number): Promise<Task | null> {
    return TaskRepository.findById(id, user_id);
  }

  static async updateTask(id: number, user_id: number, updates: Partial<Task>): Promise<Task | null> {
    if (updates.due_date && !TaskService.isValidDate(updates.due_date)) {
      throw new Error('Invalid due date');
    }
    if (updates.priority_id && ![1, 2, 3].includes(updates.priority_id)) {
      throw new Error('Invalid priority');
    }
    return TaskRepository.update(id, user_id, updates);
  }

  static async deleteTask(id: number, user_id: number): Promise<boolean> {
    return TaskRepository.delete(id, user_id);
  }

  static async listTasks(user_id: number, filters: any = {}): Promise<Task[]> {
    return TaskRepository.findAll(user_id, filters);
  }

  static validateTask(task: Partial<Task>) {
    if (!task.title || typeof task.title !== 'string' || task.title.length > 100) {
      throw new Error('Title is required and must be less than 100 characters');
    }
    if (task.description && task.description.length > 500) {
      throw new Error('Description must be less than 500 characters');
    }
    if (task.priority_id && ![1, 2, 3].includes(task.priority_id)) {
      throw new Error('Invalid priority');
    }
    if (task.due_date && !TaskService.isValidDate(task.due_date)) {
      throw new Error('Invalid due date');
    }
  }

  static isValidDate(date: string): boolean {
    return !isNaN(Date.parse(date));
  }
}
