import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source';
import { Usuario } from '../entity/Usuario';
import bcrypt from 'bcrypt';
import session from 'express-session';

export const cadastrarUsuario = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Usuario);

    const {
        tipoUsuario, nomeCompleto, email, telefone, endereco,
        senha, confirmarSenha
    } = req.body;

    if (senha !== confirmarSenha) {
        res.status(400).json({ erro: 'As senhas não coincidem.' });
        return;
    }

    const existente = await repo.findOne({ where: { email } });
    if (existente) {
        res.status(400).json({ erro: 'Email já cadastrado.' });
        return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = repo.create({
        tipoUsuario,
        nomeCompleto,
        email,
        telefone,
        endereco,
        senha: senhaHash
    });

    await repo.save(usuario);  
    req.session.usuarioId = usuario.id.toLowerCase();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
};

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;

    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        return;
    }

    req.session.usuarioId = usuario.id;

    req.session.save(err => {
        if (err) {
            console.error('Erro ao salvar sessão:', err);
            return res.status(500).json({ erro: 'Erro ao salvar sessão' });
        }
        res.json({ mensagem: 'Login bem-sucedido' });
    });
};
