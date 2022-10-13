import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_verifications')
export class EmailVerification {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'signature' })
  signature: string;

  @Column({ name: 'expiration' })
  expiration: string;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
  updateAt?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;
}
