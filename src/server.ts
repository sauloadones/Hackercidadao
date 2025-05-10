import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import { AppDataSource } from './db/data-source';
import authRoutes from './routes/authRoutes';
import ofertaRoutes from './routes/ofertaRoutes'
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS deve vir primeiro!
app.use(cors({
  origin: 'http://0.0.0.0:10000',
  credentials: true
}));


// ✅ Sessão vem antes das rotas
app.use(session({
  secret: 'segredo-boia',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,     // ⚠️ false pois está em HTTP
    sameSite: 'lax',   // ⚠️ importante para permitir cookies entre origens próximas
    maxAge: 1000 * 60 * 60
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
