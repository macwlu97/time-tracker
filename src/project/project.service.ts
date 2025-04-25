import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // create new project
  async create(name: string): Promise<Project> {
    const project = this.projectRepository.create({ name });
    return await this.projectRepository.save(project);
  }

  // get all projects
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }
}
