import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller'; // Corrected relative path
import { AuthService } from '../services/auth.service'; // Corrected relative path

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

// We bind the methods to ensure 'this' context is correct
router.post('/signup', (req, res) => authController.signUp(req, res));
router.post('/signin', (req, res) => authController.signIn(req, res));

export default router;