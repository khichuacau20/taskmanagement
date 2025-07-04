process.env.JWT_SECRET = 'test_secret';
import { UserService } from '../../src/services/UserService';
import { UserRepository } from '../../src/repositories/UserRepository';
import { UserModel } from '../../src/models/User';
import { User } from '../../src/models/User';

jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/models/User', () => ({
  ...jest.requireActual('../../src/models/User'),
  UserModel: {
    hashPassword: jest.fn((pw: string) => Promise.resolve('hashed_' + pw)),
    comparePassword: jest.fn((pw: string, hash: string) => Promise.resolve(pw === 'valid' && hash === 'hashed_valid')),
    validateEmail: jest.fn((email: string) => email.includes('@')),
    validatePassword: jest.fn((pw: string) => pw.length >= 8)
  }
}));

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password_hash: 'hashed_valid',
  name: 'Test User',
  created_at: new Date()
};

describe('UserService', () => {
  afterEach(() => jest.clearAllMocks());

  it('should register a user with valid data', async () => {
    (UserRepository.create as jest.Mock).mockResolvedValue(mockUser);

 const result = await UserService.register('test@example.com', 'validpass', 'Test User');
    expect(result).toEqual(mockUser);
  });

  it('should throw error for invalid email', async () => {
    await expect(UserService.register('invalid', 'valid', 'Test User')).rejects.toThrow('Invalid email');
  });

  it('should throw error for weak password', async () => {
    await expect(UserService.register('test@example.com', 'short', 'Test User')).rejects.toThrow('Password does not meet strength requirements');
  });

  it('should authenticate with valid credentials', async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    const { user, token } = await UserService.authenticate('test@example.com', 'valid');
    expect(user).toEqual(mockUser);
    expect(typeof token).toBe('string');
  });

  it('should throw error for invalid credentials', async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(UserService.authenticate('wrong@example.com', 'invalid')).rejects.toThrow('Invalid email or password');
  });

  it('should get user profile', async () => {
    (UserRepository.findById as jest.Mock).mockResolvedValue(mockUser);
    const result = await UserService.getProfile(1);
    expect(result).toEqual(mockUser);
  });

  it('should update user profile', async () => {
    (UserRepository.updateName as jest.Mock).mockResolvedValue({ ...mockUser, name: 'Updated' });
    const result = await UserService.updateProfile(1, 'Updated');
    expect(result?.name).toBe('Updated');
  });

  it('should reset password with valid new password', async () => {
    (UserRepository.updatePassword as jest.Mock).mockResolvedValue(true);
    const result = await UserService.resetPassword(1, 'validpassword');
    expect(result).toBe(true);
  });
});
