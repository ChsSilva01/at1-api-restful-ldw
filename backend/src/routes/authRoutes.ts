import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', AuthController.login);

router.get('/profile', authMiddleware, AuthController.profile);

export { router as authRoutes };
