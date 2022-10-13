import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'verify_token', nullable: true })
  verifyToken: string | null = null;

  @Column({ name: 'is_verify' })
  isVerify: boolean;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
  updateAt?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;
}
