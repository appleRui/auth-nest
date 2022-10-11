import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_verifications')
export class EmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  signature: string;

  @Column()
  expiration: string;
}
