import { TaskService } from '../../src/services/TaskService';
import { TaskRepository } from '../../src/repositories/TaskRepository';
import { Task } from '../../src/models/Task';

jest.mock('../../src/repositories/TaskRepository');

const mockTask: Task = {
  id: 1,
  user_id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  priority_id: 2,
  category_id: 1,
  due_date: '2025-07-10',
  created_at: new Date(),
  updated_at: new Date()
};
import {
  createTestUser,
  deleteTestUser,
  createTestTask,
  deleteTestTask,
  getUserIdByEmail,
  clearUserTasks,
  testUser,
  pool
} from '../utils/testUtils';

beforeAll(async () => {
  await createTestUser();
});

afterAll(async () => {
  const userId = await getUserIdByEmail(testUser.email);
  if (userId) await clearUserTasks(userId);
  await deleteTestUser();
  await pool.end();
});
describe('TaskService', () => {
  afterEach(() => jest.clearAllMocks());

  it('should create a task with valid data', async () => {
    (TaskRepository.create as jest.Mock).mockResolvedValue(mockTask);
    const { id, created_at, updated_at, ...taskData } = mockTask;
    const result = await TaskService.createTask(taskData);
    // const result = await TaskService.createTask({ ...mockTask, id: undefined, created_at: undefined, updated_at: undefined });
    expect(result).toEqual(mockTask);
  });

  it('should throw error for invalid title', async () => {
    await expect(TaskService.createTask({ ...mockTask, title: '' })).rejects.toThrow('Title is required');
  });

  it('should get a task by id', async () => {
    (TaskRepository.findById as jest.Mock).mockResolvedValue(mockTask);
    const result = await TaskService.getTask(1, 1);
    expect(result).toEqual(mockTask);
  });

  it('should return null if task not found', async () => {
    (TaskRepository.findById as jest.Mock).mockResolvedValue(null);
    const result = await TaskService.getTask(999, 1);
    expect(result).toBeNull();
  });

  it('should update a task', async () => {
    (TaskRepository.update as jest.Mock).mockResolvedValue({ ...mockTask, title: 'Updated' });
    const result = await TaskService.updateTask(1, 1, { title: 'Updated' });
    expect(result?.title).toBe('Updated');
  });

  it('should delete a task', async () => {
    (TaskRepository.delete as jest.Mock).mockResolvedValue(true);
    const result = await TaskService.deleteTask(1, 1);
    expect(result).toBe(true);
  });

  it('should list tasks with filters', async () => {
    (TaskRepository.findAll as jest.Mock).mockResolvedValue([mockTask]);
    const result = await TaskService.listTasks(1, { completed: false });
    expect(result).toEqual([mockTask]);
  });
});
