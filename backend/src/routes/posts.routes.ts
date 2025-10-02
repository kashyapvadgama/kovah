import { Router } from 'express';
import { PostsController } from '../controllers/posts.controller';
import { PostsService } from '../services/posts.service';
// FIX: Changed 'auth.Middleware' to 'auth.middleware'
import { authMiddleware } from '../middleware/auth.middleware'; 

const router = Router();
const postsService = new PostsService();
const postsController = new PostsController(postsService);

// GET /api/posts - Get all posts for the feed (public for now)
router.get('/', (req, res) => postsController.getFeedPosts(req, res));

// POST /api/posts - Create a new post (protected route)
router.post('/', authMiddleware, (req, res) => postsController.createPost(req, res));

export default router;