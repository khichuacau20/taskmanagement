import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import * as taskController from '../controllers/taskController';
import * as userController from '../controllers/userController';

const router = Router();

// User routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.get('/users/me', authenticateJWT, userController.getProfile);
router.put('/users/me', authenticateJWT, userController.updateProfile);

// Task routes (protected)
router.post('/tasks', authenticateJWT, taskController.createTask);
router.get('/tasks', authenticateJWT, taskController.listTasks);
router.get('/tasks/:id', authenticateJWT, taskController.getTask);
router.put('/tasks/:id', authenticateJWT, taskController.updateTask);
router.delete('/tasks/:id', authenticateJWT, taskController.deleteTask);

export default router;
