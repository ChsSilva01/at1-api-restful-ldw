import { Router } from 'express';
import { AgendamentoController } from '../controllers/AgendamentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', AgendamentoController.index);
router.get('/:id', AgendamentoController.show);
router.post('/', AgendamentoController.create);
router.put('/:id', AgendamentoController.update);
router.delete('/:id', AgendamentoController.delete);

export { router as AgendamentoRoutes };
