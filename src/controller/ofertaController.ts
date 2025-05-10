import { Request, Response } from 'express';

import { Oferta } from '../entity/NovaOferta';

import { Usuario } from '../entity/Usuario';

import { AppDataSource } from '../db/data-source';



export const salvarOferta = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.session.usuarioId?.toLowerCase(); // ✅ aplica toLowerCase aqui
    if (!usuarioId) {
      res.status(401).json({ erro: 'Usuário não autenticado.' });
      return;
    }

    const usuario = await AppDataSource.getRepository(Usuario).findOneBy({ id: usuarioId });
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
      return;
    }

    const {
      tipoAlimento, quantidade, unidade,
      validade, prazoRetirada, horario,
      endereco, instrucoes, termosOferta, compostagem
    } = req.body;

    const fotos = (req.files as Express.Multer.File[]).map(f => (f as any).path);

    const repo = AppDataSource.getRepository(Oferta);
    const novaOferta = repo.create({
      tipoAlimento,
      quantidade: parseFloat(quantidade),
      unidade,
      validade,
      prazoRetirada,
      horario,
      endereco,
      instrucoes,
      termosOferta: termosOferta === 'on',
      compostagem: compostagem === 'on',
      fotos,
      usuario,
      usuarioId: usuario.id.toLowerCase() // ✅ garante lowercase no campo explicitamente salvo
    });

    await repo.save(novaOferta);
    res.status(201).json({ mensagem: 'Oferta publicada com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao salvar oferta:', error);
    res.status(500).json({ erro: 'Erro ao salvar a oferta.' });
  }
};

export const listarMinhasOfertas = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = req.session?.usuarioId?.toLowerCase();
  const { status, ordenar } = req.query; // 

  if (!usuarioId) {
    res.status(401).json({ erro: 'Usuário não autenticado.' });
    return;
  }

  try {
    const repo = AppDataSource.getRepository(Oferta);

    let query = repo.createQueryBuilder('oferta')
      .leftJoinAndSelect('oferta.usuario', 'usuario')
      .where('usuario.id = :usuarioId', { usuarioId });

  
    if (status && status !== 'todas') {
      query = query.andWhere('LOWER(oferta.status) = :status', { status: String(status).toLowerCase() });
    }

    if (ordenar === 'quantidade') {
      query = query.orderBy('oferta.quantidade', 'DESC');
    } else if (ordenar === 'antigas') {
      query = query.orderBy('oferta.criadaEm', 'ASC');
    } else {
     
      query = query.orderBy('oferta.criadaEm', 'DESC');
    }

    const ofertas = await query.getMany();
    res.status(200).json(ofertas);

  } catch (error) {
    console.error('❌ Erro ao listar ofertas com filtros:', error);
    res.status(500).json({ erro: 'Erro ao listar ofertas.' });
  }
};


export const cancelarOferta = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = req.session.usuarioId?.toLowerCase();
  const { id } = req.params;
  id.toLocaleLowerCase()
  console.log(id)
  if (!usuarioId) {
    res.status(401).json({ erro: 'Usuário não autenticado.' });
    return;
  }

  try {
    const repo = AppDataSource.getRepository(Oferta);
    const oferta = await repo.findOne({ where: { id, usuarioId } });

    if (!oferta) {
      res.status(404).json({ erro: 'Oferta não encontrada.' });
      return;
    }

    oferta.status = 'cancelada'; // ou 'inativa' dependendo da lógica de negócio
    await repo.save(oferta);

    res.status(200).json({ mensagem: 'Oferta cancelada com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao cancelar oferta:', error);
    res.status(500).json({ erro: 'Erro ao cancelar a oferta.' });
  }
}
export const obterResumoDashboard = async (req: Request, res: Response): Promise<void>=> {
  const usuarioId = req.session?.usuarioId?.toLowerCase();

  if (!usuarioId) {
    res.status(401).json({ erro: 'Usuário não autenticado.' });
    return
  }

  try {
    const ofertaRepo = AppDataSource.getRepository(Oferta);

    const [ativas, pendentes] = await Promise.all([
      ofertaRepo.find({ where: { usuarioId, status: 'ativa' } }),
      ofertaRepo.find({ where: { usuarioId, status: 'pendente' } })
    ]);

    const totalKg = [...ativas, ...pendentes]
      .filter(o => !isNaN(Number(o.quantidade)))
      .reduce((soma, o) => soma + Number(o.quantidade), 0);

    res.json({
      trocasRealizadas: 0, // temporariamente zerado
      alimentosDoados: totalKg,
      ofertas: [...ativas, ...pendentes]
    });
  } catch (error) {
    console.error('Erro no resumo do dashboard:', error);
    res.status(500).json({ erro: 'Erro ao obter dados do dashboard' });
  }
};
export const listarDoacoesPublicas = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = req.session?.usuarioId?.toLowerCase();

  if (!usuarioId) {
    res.status(401).json({ erro: 'Usuário não autenticado.' });
    return
  }

  const { tipo, ordenar } = req.query;

  try {
    const repo = AppDataSource.getRepository(Oferta);
    let query = repo.createQueryBuilder('oferta')
      .leftJoinAndSelect('oferta.usuario', 'usuario')
      .where('oferta.status = :status', { status: 'ativa' })
      .andWhere('oferta.usuarioId != :usuarioId', { usuarioId }); // exclui ofertas do próprio usuário

    if (tipo) {
      query = query.andWhere('LOWER(oferta.tipoAlimento) = :tipo', { tipo: String(tipo).toLowerCase() });
    }

    if (ordenar === 'quantidade') {
      query = query.orderBy('oferta.quantidade', 'DESC');
    } else {
      query = query.orderBy('oferta.criadaEm', 'DESC');
    }
    console.log('Filtro tipo recebido:', tipo);

    const ofertas = await query.getMany();
    res.json(ofertas);
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ erro: 'Erro ao buscar doações públicas.' });
  }
};
