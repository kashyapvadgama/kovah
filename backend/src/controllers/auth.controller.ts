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

  // --- THIS IS THE UPDATED FUNCTION ---
  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Call the service to handle the logic
      const result = await this.authService.signIn({ email, password });
      
      // The service returns null if credentials are bad
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
      }
      
      // If successful, send back the token and user info
      res.status(200).json(result);

    } catch (error: any) {
      res.status(500).json({ message: error.message || 'An unexpected error occurred.' });
    }
  }
}