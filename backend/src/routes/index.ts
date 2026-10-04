import { Router } from 'express';
import { AgendamentoRoutes } from './agendamentoRoutes.js';
import { authRoutes } from './authRoutes.js';
import { userRoutes } from './userRoutes.js';

const router = Router();

router.use('/agendamentos', AgendamentoRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export { router as appRoutes };
