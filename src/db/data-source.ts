import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Usuario } from '../entity/Usuario';
import { Oferta } from '../entity/NovaOferta';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    extra: {
        trustServerCertificate: true // necessário para conexão com Azure SQL
    },
    options: {
        encrypt: true,
    },
    entities: [Usuario, Oferta],
});

