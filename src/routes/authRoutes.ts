// src/routes/auth.ts
import express from 'express';
import { cadastrarUsuario } from '../controller/authController';
import { loginUsuario } from '../controller/authController';
import { perfilUsuario } from '../controller/authController';
import { verificaSessao } from '../middleware/verificaSessao'

const router = express.Router();

// Rota POST para cadastro de usuário
router.post('/cadastro', cadastrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', verificaSessao, perfilUsuario)


export default router;
