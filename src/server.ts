import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import { AppDataSource } from './db/data-source';
import authRoutes from './routes/authRoutes';
import ofertaRoutes from './routes/ofertaRoutes'
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ CORS deve vir primeiro!


app.use(cors({
  origin: 'https://transcendent-custard-4dfe61.netlify.app',
  credentials: true
}));

app.use(session({
  secret: 'chave-super-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,         // 🔒 obrigatório no HTTPS
    sameSite: 'none'      // 🔥 ESSENCIAL para cross-domain
  }
}));
// ✅ Body parser depois da sessão
app.use(bodyParser.json());

// ✅ Suas rotas
app.use('/api/auth', authRoutes);
app.use('/api/oferta', ofertaRoutes);
app.use('/uploads', express.static('uploads'));

// ✅ Inicializa servidor e banco
AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco de dados conectado com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  });
