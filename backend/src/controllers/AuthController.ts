import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../config/auth.js';

export class AuthController {
  // POST /api/auth/login
  public static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ erro: 'Email e senha sao obrigatorios.' });
      }

      const user = await User.findOne({
        where: { email: email.trim().toLowerCase() },
      });
      if (!user || !user.senha_hash) {
        return res.status(401).json({ erro: 'Credenciais invalidas.' });
      }

      const senhaValida = await bcrypt.compare(password, user.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais invalidas.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, nome: user.nome },
        JWT_SECRET,
        { expiresIn: '1h' },
      );

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        token,
      });
    } catch (error: any) {
      return res.status(500).json({ erro: error.message });
    }
  }

  static async profile(req: Request, res: Response): Promise<Response> {
    try {
      const authUser = (req as any).user;

      if (!authUser) {
        return res.status(401).json({ erro: 'Utilizador não autenticado.' });
      }

      return res.status(200).json({
        id: authUser.id,
        nome: authUser.nome,
        email: authUser.email,
      });
    } catch (error: any) {
      return res.status(500).json({
        erro: 'Erro ao buscar perfil.',
        detalhe: error.message,
      });
    }
  }
}
