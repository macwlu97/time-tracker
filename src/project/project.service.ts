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
  async findAll(
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Project[]; total: number }> {
    const [data, total] = await this.projectRepository.findAndCount({
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return { data, total };
  }
  
}
