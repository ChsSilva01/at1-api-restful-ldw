import { Request, Response } from 'express';
import { Agendamento } from '../models/Agendamento';

export class AgendamentoController {
  // GET /api/agendamentos
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const agendamentos = await Agendamento.findAll({
        attributes: ['id', 'paciente', 'profissional', 'data_horario', 'status', 'createdAt']
      });
      return res.status(200).json(agendamentos);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao listar agendamentos.', detalhe: error.message });
    }
  }

  // GET /api/agendamentos/:id
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido.' });
      }

      const agendamento = await Agendamento.findByPk(id, {
        attributes: ['id', 'paciente', 'profissional', 'data_horario', 'status', 'createdAt']
      });

      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento nao encontrado.' });
      }

      return res.status(200).json(agendamento);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao buscar agendamento.', detalhe: error.message });
    }
  }

  // POST /api/agendamentos
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { paciente, profissional, data_horario } = req.body;

      if (!paciente || typeof paciente !== 'string' || paciente.trim() === '') {
        return res.status(400).json({ erro: 'O campo paciente e obrigatorio.' });
      }

      if (!profissional || typeof profissional !== 'string' || profissional.trim() === '') {
        return res.status(400).json({ erro: 'O campo profissional e obrigatorio.' });
      }

      if (!data_horario || typeof data_horario !== 'string' || isNaN(Date.parse(data_horario))) {
        return res.status(400).json({ erro: 'Informe uma data e horario validos.' });
      }

      // Converte a string para um objeto Date
      const dataFormatada = new Date(data_horario.trim());

      const agendamentoExistente = await Agendamento.findOne({ 
        where: { profissional: profissional.trim(), data_horario: dataFormatada } 
      });
      if (agendamentoExistente) {
        return res.status(409).json({ erro: 'Este profissional ja possui um agendamento neste horario.' });
      }

      const novoAgendamento = await Agendamento.create({
        paciente: paciente.trim(),
        profissional: profissional.trim(),
        data_horario: dataFormatada // Agora passa o Date e o TypeScript fica feliz
      });

      return res.status(201).json({
        id: novoAgendamento.id,
        paciente: novoAgendamento.paciente,
        profissional: novoAgendamento.profissional,
        data_horario: novoAgendamento.data_horario,
        status: novoAgendamento.status,
        createdAt: novoAgendamento.createdAt
      });
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao cadastrar agendamento.', detalhe: error.message });
    }
  }

  // PUT /api/agendamentos/:id
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido.' });
      }

      const { paciente, profissional, data_horario, status } = req.body;

      const agendamento = await Agendamento.findByPk(id);
      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento nao encontrado para atualizacao.' });
      }

      if (paciente !== undefined) {
        if (typeof paciente !== 'string' || paciente.trim() === '') {
          return res.status(400).json({ erro: 'O campo paciente deve ser um texto valido.' });
        }
        agendamento.paciente = paciente.trim();
      }

      if (profissional !== undefined) {
        if (typeof profissional !== 'string' || profissional.trim() === '') {
          return res.status(400).json({ erro: 'O campo profissional deve ser um texto valido.' });
        }
        agendamento.profissional = profissional.trim();
      }

      if (data_horario !== undefined) {
        if (typeof data_horario !== 'string' || isNaN(Date.parse(data_horario))) {
          return res.status(400).json({ erro: 'A data informada e invalida.' });
        }

        const dataFormatada = new Date(data_horario.trim());

        const horarioOcupado = await Agendamento.findOne({ 
          where: { profissional: agendamento.profissional, data_horario: dataFormatada } 
        });
        if (horarioOcupado && horarioOcupado.id !== id) {
          return res.status(409).json({ erro: 'Este horario ja esta reservado para este profissional.' });
        }

        agendamento.data_horario = dataFormatada;
      }

      if (status !== undefined) {
        agendamento.status = status;
      }

      await agendamento.save();

      return res.status(200).json({
        id: agendamento.id,
        paciente: agendamento.paciente,
        profissional: agendamento.profissional,
        data_horario: agendamento.data_horario,
        status: agendamento.status,
        updatedAt: agendamento.updatedAt
      });
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao atualizar agendamento.', detalhe: error.message });
    }
  }

  // DELETE /api/agendamentos/:id
  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'O ID informado deve ser um numero valido.' });
      }

      const agendamento = await Agendamento.findByPk(id);
      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento nao encontrado para exclusao.' });
      }

      await agendamento.destroy();
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao excluir agendamento.', detalhe: error.message });
    }
  }
}