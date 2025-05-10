import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './Usuario';
@Entity('ofertas')
export class Oferta {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tipoAlimento!: string;

  @Column('float')
  quantidade!: number;

  @Column()
  unidade!: string;

  @Column({ type: 'date' })
  validade!: string;

  @Column({ type: 'date' })
  prazoRetirada!: string;

  @Column()
  horario!: string;

  @Column()
  endereco!: string;

  @Column({ nullable: true })
  instrucoes!: string;

  @Column('simple-array', { nullable: true })
  fotos!: string[]; // salvar nomes dos arquivos

  @Column()
  termosOferta!: boolean;

  @Column()
  compostagem!: boolean;

  @CreateDateColumn()
  criadaEm!: Date;

  @Column({ default: 'ativa' }) // ✅ novo campo
  status!: 'ativa' | 'pendente' | 'concluida' | 'cancelada';

  @ManyToOne(() => Usuario, { eager: true }) // eager: carrega automaticamente o usuário
  @JoinColumn({ name: 'usuarioId' })         // nome da coluna FK no banco
  usuario!: Usuario;

  @Column()
  usuarioId!: string; // UUID do usuário


}
