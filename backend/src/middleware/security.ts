import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Password strength validation middleware
export function validatePasswordStrength(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!password || !strongPassword.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
  }
  next();
}

// Rate limiting middleware for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// Helmet middleware for security headers
export const securityHeaders = helmet();
