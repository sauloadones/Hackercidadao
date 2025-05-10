import { Request, Response, NextFunction } from 'express';

export function verificaSessao(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.usuarioId) {
        return next();
    }

    res.status(401).json({ erro: 'Usuário não autenticado.' });
}
