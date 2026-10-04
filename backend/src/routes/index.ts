import { Router } from 'express';
import { AgendamentoRoutes } from './agendamentoRoutes';

const router = Router();

// Registra as rotas de agendamentos sob o prefixo /agendamentos
router.use('/agendamentos', AgendamentoRoutes);

export { router as appRoutes };