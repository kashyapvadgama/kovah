import { Request, Response } from 'express';
import { PostsService } from '../services/posts.service';
import { AuthenticatedRequest } from '../interfaces'; // <-- IMPORT our custom interface

export class PostsController {
  constructor(private postsService: PostsService) {}

  // Use the AuthenticatedRequest type for this specific controller method
  async createPost(req: AuthenticatedRequest, res: Response) { 
    try {
      const { content, mediaUrls, mediaType } = req.body;
      
      // Now TypeScript knows that req.user exists and has a userId property
      const userId = req.user?.userId;

      if (!userId) {
        // This check is good for safety, in case the middleware fails
        return res.status(401).json({ message: 'Authentication required.' });
      }

      if (!content && (!mediaUrls || mediaUrls.length === 0)) {
        return res.status(400).json({ message: 'Post cannot be empty.' });
      }

      const post = await this.postsService.createPost({
        userId,
        content,
        mediaUrls,
        mediaType,
      });
      res.status(201).json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to create post.' });
    }
  }

  // This controller doesn't need the user, so it can use the standard Request type
  async getFeedPosts(req: Request, res: Response) {
    try {
      const posts = await this.postsService.getFeedPosts();
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch feed.' });
    }
  }
}