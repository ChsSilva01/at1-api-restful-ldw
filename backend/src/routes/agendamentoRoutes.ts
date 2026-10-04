import { Router } from 'express';
import { AgendamentoController } from '../controllers/AgendamentoController';

const router = Router();

router.get('/', AgendamentoController.index);
router.get('/:id', AgendamentoController.show);
router.post('/', AgendamentoController.create);
router.put('/:id', AgendamentoController.update);
router.delete('/:id', AgendamentoController.delete);

export { router as AgendamentoRoutes };