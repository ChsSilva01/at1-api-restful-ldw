import { Router, Request, Response } from 'express';
import { Agendamento } from '../models/Agendamento';

const router = Router();

// GET /api/agendamentos - Listar todos os agendamentos
router.get('/', async (req: Request, res: Response) => {
  try {
    const agendamentos = await Agendamento.findAll({
      attributes: ['id', 'paciente', 'profissional', 'data_horario', 'status', 'createdAt']
    });
    return res.status(200).json(agendamentos);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao listar agendamentos.', detalhe: error.message });
  }
});

// GET /api/agendamentos/:id - Buscar um agendamento por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const agendamento = await Agendamento.findByPk(Number(id), {
      attributes: ['id', 'paciente', 'profissional', 'data_horario', 'status', 'createdAt']
    });

    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento nao encontrado.' });
    }

    return res.status(200).json(agendamento);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao buscar agendamento.', detalhe: error.message });
  }
});

// POST /api/agendamentos - Cadastrar um novo agendamento
router.post('/', async (req: Request, res: Response) => {
  try {
    const { paciente, profissional, data_horario } = req.body;

    if (!paciente || !profissional || !data_horario) {
      return res.status(400).json({ erro: 'paciente, profissional e data_horario sao obrigatorios.' });
    }

    const novoAgendamento = await Agendamento.create({ paciente, profissional, data_horario });
    return res.status(201).json(novoAgendamento);
  } catch (error: any) {
    return res.status(500).json({ erro: 'Erro ao criar agendamento.', detalhe: error.message });
  }
});

export { router as AgendamentoRoutes };