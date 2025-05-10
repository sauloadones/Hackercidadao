import express from 'express';
import { upload } from '../config/cloudinary';
import { salvarOferta } from '../controller/ofertaController';
import { verificaSessao } from '../middleware/verificaSessao'
import { listarMinhasOfertas } from '../controller/ofertaController';
import { cancelarOferta } from '../controller/ofertaController';
import { obterResumoDashboard } from '../controller/ofertaController';
import { listarDoacoesPublicas } from '../controller/ofertaController';
const router = express.Router();

router.post('/nova', verificaSessao, upload.array('fotos', 5), salvarOferta);
router.get('/minhas', verificaSessao, listarMinhasOfertas);
router.patch('/:id/cancelar', verificaSessao, cancelarOferta);
router.get('/resumo', verificaSessao, obterResumoDashboard);
router.get('/doacoes', verificaSessao, listarDoacoesPublicas)
export default router;
