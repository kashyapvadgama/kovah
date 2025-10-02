import { Request } from 'express';

// Define a new interface that extends the original Request
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    iat: number;
    exp: number;
  };
}