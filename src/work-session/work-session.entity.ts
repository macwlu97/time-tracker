import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Entity()
export class WorkSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @ManyToOne(() => Project, (project) => project.sessions)
  project: Project;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column()
  description: string;
}
