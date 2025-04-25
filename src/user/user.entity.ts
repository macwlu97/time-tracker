import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WorkSession } from 'src/work-session/work-session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => WorkSession, (session) => session.user)
  sessions: WorkSession[];
}
