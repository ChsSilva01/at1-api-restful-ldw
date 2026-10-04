import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token nao fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    const usuarioDecodificado = jwt.verify(token, JWT_SECRET);

    (req as any).user = usuarioDecodificado;

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}