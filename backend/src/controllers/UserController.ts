import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export class UserController {
  // GET /api/users
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll({
        attributes: ['id', 'nome', 'email', 'createdAt'],
      });
      return res.status(200).json(users);
    } catch (error: any) {
      return res
        .status(500)
        .json({ erro: 'Erro ao listar usuarios.', detalhe: error.message });
    }
  }

  // POST /api/users - Cadastra usuario (medico/atendente) com hash seguro
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, password } = req.body;

      if (!nome || !email || !password) {
        return res
          .status(400)
          .json({ erro: 'Nome, email e senha sao obrigatorios.' });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ erro: 'A senha deve conter no minimo 6 caracteres.' });
      }

      const userExistente = await User.findOne({
        where: { email: email.trim().toLowerCase() },
      });
      if (userExistente) {
        return res
          .status(409)
          .json({ erro: 'Ja existe um usuario cadastrado com este e-mail.' });
      }

      const senha_hash = await bcrypt.hash(password, 10);

      const novoUser = await User.create({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha_hash,
      });

      return res.status(201).json({
        mensagem: 'Usuario cadastrado com sucesso!',
        usuario: {
          id: novoUser.id,
          nome: novoUser.nome,
          email: novoUser.email,
        },
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ erro: 'Erro ao cadastrar usuario.', detalhe: error.message });
    }
  }
}
