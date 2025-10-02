import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces'; // <-- IMPORT our custom interface

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-please-change';

// Use AuthenticatedRequest instead of the generic Request
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Now TypeScript knows that req.user is a valid property on AuthenticatedRequest
    req.user = decoded as any; // We cast to 'any' here for simplicity
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};