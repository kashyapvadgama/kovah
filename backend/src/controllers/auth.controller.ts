import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../interfaces';

export class AuthController {
  constructor(private authService: AuthService) {}

  async signUp(req: Request, res: Response) {
    try {
      const { username, fullName, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }
      const result = await this.authService.signUp({ username, fullName, email, password });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'An unexpected error occurred.' });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const result = await this.authService.signIn({ email, password });
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
      }
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'An unexpected error occurred.' });
    }
  }
  
  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userProfile = await this.authService.getProfileById(userId);
      if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      res.status(200).json(userProfile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
