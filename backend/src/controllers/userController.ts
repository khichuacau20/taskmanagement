import { Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await UserService.register(email, password, name);
    res.status(201).json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.authenticate(email, password);
    res.json({ user, token });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Login failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await UserService.getProfile(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to get profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await UserService.updateProfile(userId, name);
    if (!user) return res.status(404).json({ error: 'User not found or not updated' });
    res.json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
};
