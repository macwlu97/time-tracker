import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { WorkSession } from '../work-session/work-session.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Many-to-Many relation with User
  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  // One-to-Many relation with WorkSession
  @OneToMany(() => WorkSession, (session) => session.project)
  sessions: WorkSession[]; // This will hold all work sessions related to this project
}
