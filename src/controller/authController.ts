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

    if (!usuario) {
        res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        return;
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        return;
    }
    req.session.usuarioId = usuario.id.toLowerCase();

    console.log('✅ ID salvo na sessão:', usuario.id);

    res.status(200).json({ mensagem: 'Login realizado com sucesso!'});
  

};
export const perfilUsuario = async (req: Request, res: Response): Promise<void> => {
  const usuarioIdRaw = req.session?.usuarioId;

  if (!usuarioIdRaw) {
    console.warn('⚠️ Sessão inválida: sem usuarioId');
    res.status(401).json({ erro: 'Não autenticado.' });
    return;
  }

  const usuarioId = usuarioIdRaw.toLowerCase();
  console.log('🔎 ID da sessão:', usuarioId);

  try {
    const usuario = await AppDataSource.getRepository(Usuario).findOne({
      where: { id: usuarioId }
    });

    if (!usuario) {
      console.warn('❌ Usuário não encontrado no banco com ID:', usuarioId);
      res.status(404).json({ erro: 'Usuário não encontrado.' });
      return;
    }

    console.log('✅ Usuário encontrado:', usuario.nomeCompleto);
    res.json({ nome: usuario.nomeCompleto, email: usuario.email });

  } catch (error) {
    console.error('❌ Erro no perfilUsuario:', error);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};
