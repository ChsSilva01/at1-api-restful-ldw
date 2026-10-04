import { Request, Response } from 'express';
import { Agendamento } from '../models/Agendamento';

export class AgendamentoController {
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const agendamentos = await Agendamento.findAll({
        attributes: ['id', 'paciente', 'profissional', 'data_horario', 'status', 'createdAt', 'updatedAt'],
        order: [['data_horario', 'ASC']] // Lista as consultas por ordem de data
      });
      return res.status(200).json(agendamentos);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao listar agendamentos.', detalhe: error.message });
    }
  }

  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const agendamento = await Agendamento.findByPk(Number(id), {
        attributes: ['id', 'paciente', 'profissional', 'data_horario', 'status', 'createdAt', 'updatedAt']
      });

      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento nao encontrado.' });
      }

      return res.status(200).json(agendamento);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao buscar agendamento.', detalhe: error.message });
    }
  }

  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { paciente, profissional, data_horario } = req.body;

      if (!paciente || !profissional || !data_horario) {
        return res.status(400).json({ erro: 'Os campos paciente, profissional e data_horario sao obrigatorios.' });
      }

      const novoAgendamento = await Agendamento.create({ paciente, profissional, data_horario });

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

  // PUT /api/agendamentos/:id - Atualizar um agendamento existente
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status, data_horario } = req.body;

      const agendamento = await Agendamento.findByPk(Number(id));

      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento nao encontrado para atualizacao.' });
      }

      if (status) agendamento.status = status;
      if (data_horario) agendamento.data_horario = data_horario;

      await agendamento.save();

      return res.status(200).json({
        id: agendamento.id,
        paciente: agendamento.paciente,
        status: agendamento.status,
        data_horario: agendamento.data_horario,
        updatedAt: agendamento.updatedAt
      });
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao atualizar agendamento.', detalhe: error.message });
    }
  }

  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const agendamento = await Agendamento.findByPk(Number(id));

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