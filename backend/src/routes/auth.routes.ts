import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware'; // Import middleware

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/signup', (req, res) => authController.signUp(req, res));
router.post('/signin', (req, res) => authController.signIn(req, res));

// --- ADD THIS NEW PROTECTED ROUTE ---
router.get('/me', authMiddleware, (req, res) => authController.getMe(req, res));

export default router;
