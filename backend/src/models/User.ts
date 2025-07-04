import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  created_at?: Date;
}

export class UserModel {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return strongPassword.test(password);
  }
}
