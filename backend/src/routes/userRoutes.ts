import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();

router.get('/', UserController.index);
router.post('/', UserController.create);

export { router as userRoutes };