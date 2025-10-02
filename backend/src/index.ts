import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/posts.routes'; // <-- IMPORT POST ROUTES

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Kovah API! 🚀' });
});

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); // <-- USE POST ROUTES

app.listen(port, () => {
  console.log(`🚀 Kovah backend is running on http://localhost:${port}`);
});