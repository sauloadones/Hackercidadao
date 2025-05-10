import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuarios') // nome explícito da tabela
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50 })
    tipoUsuario!: string;

    @Column({ type: 'varchar', length: 100 })
    nomeCompleto!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 20 })
    telefone!: string;

    @Column({ type: 'varchar', length: 150 })
    endereco!: string;

    @Column({ type: 'varchar', length: 255 })
    senha!: string;

    @CreateDateColumn({ type: 'datetime' })
    criadoEm!: Date;
}
