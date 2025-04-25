import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository: Repository<Project>;

  // Mockowanie repozytorium
  const mockProjectRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const projectName = 'New Project';
      const createdProject = { id: 1, name: projectName };
      mockProjectRepository.create.mockReturnValue(createdProject);
      mockProjectRepository.save.mockResolvedValue(createdProject);

      const result = await projectService.create(projectName);

      expect(result).toEqual(createdProject);
      expect(mockProjectRepository.create).toHaveBeenCalledWith({ name: projectName });
      expect(mockProjectRepository.save).toHaveBeenCalledWith(createdProject);
    });
  });

  describe('findAll', () => {
    it('should return paginated and sorted projects', async () => {
      const projects = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ];
      const total = 2;
      mockProjectRepository.findAndCount.mockResolvedValue([projects, total]);

      const result = await projectService.findAll(1, 10, 'name', 'ASC');

      expect(result).toEqual({ data: projects, total });
      expect(mockProjectRepository.findAndCount).toHaveBeenCalledWith({
        order: { name: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('should return paginated projects with default values', async () => {
      const projects = [{ id: 1, name: 'Project 1' }];
      const total = 1;
      mockProjectRepository.findAndCount.mockResolvedValue([projects, total]);

      const result = await projectService.findAll();

      expect(result).toEqual({ data: projects, total });
      expect(mockProjectRepository.findAndCount).toHaveBeenCalledWith({
        order: { name: 'ASC' },
        skip: 0,
        take: 10,
      });
    });
  });
});
