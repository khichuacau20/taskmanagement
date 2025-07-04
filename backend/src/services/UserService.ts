import { UserRepository } from '../repositories/UserRepository';
import { UserModel } from '../models/User';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export class UserService {
  static async register(email: string, password: string, name?: string): Promise<User> {
    if (!UserModel.validateEmail(email)) {
      throw new Error('Invalid email');
    }
    if (!UserModel.validatePassword(password)) {
      throw new Error('Password does not meet strength requirements');
    }
    const password_hash = await UserModel.hashPassword(password);
    return UserRepository.create(email, password_hash, name);
  }

  static async authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');
    const valid = await UserModel.comparePassword(password, user.password_hash);
    if (!valid) throw new Error('Invalid email or password');
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    return { user, token };
  }

  static async getProfile(id: number): Promise<User | null> {
    return UserRepository.findById(id);
  }

  static async updateProfile(id: number, name: string): Promise<User | null> {
    return UserRepository.updateName(id, name);
  }

  static async resetPassword(id: number, newPassword: string): Promise<boolean> {
    if (!UserModel.validatePassword(newPassword)) {
      throw new Error('Password does not meet strength requirements');
    }
    const password_hash = await UserModel.hashPassword(newPassword);
    const result = await UserRepository.updatePassword(id, password_hash);
    return result;
  }
}
