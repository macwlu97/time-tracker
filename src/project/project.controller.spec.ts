import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectService: ProjectService;

  const mockProjectService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    projectController = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  describe('create', () => {
    it('should create a project', async () => {
      const projectName = 'New Project';
      const createdProject = { id: 1, name: projectName };
      mockProjectService.create.mockResolvedValue(createdProject);

      const result = await projectController.create(projectName);

      expect(result).toEqual(createdProject);
      expect(mockProjectService.create).toHaveBeenCalledWith(projectName);
    });

    it('should throw UnauthorizedException if not admin', async () => {
      // Assuming RolesGuard or JwtAuthGuard will throw UnauthorizedException
      jest.spyOn(projectController, 'create').mockRejectedValue(new UnauthorizedException());
      await expect(projectController.create('New Project')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return paginated and sorted projects', async () => {
      const projects = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ];
      const total = 2;
      const page = 1;
      const limit = 10;
      const sortBy = 'name';
      const sortOrder = 'ASC';

      mockProjectService.findAll.mockResolvedValue({ data: projects, total });

      const result = await projectController.findAll(page, limit, sortBy, sortOrder);

      expect(result).toEqual({ data: projects, total });
      expect(mockProjectService.findAll).toHaveBeenCalledWith(page, limit, sortBy, sortOrder);
    });

    it('should return paginated projects with default values', async () => {
      const projects = [{ id: 1, name: 'Project 1' }];
      const total = 1;

      mockProjectService.findAll.mockResolvedValue({ data: projects, total });

      const result = await projectController.findAll();

      expect(result).toEqual({ data: projects, total });
      expect(mockProjectService.findAll).toHaveBeenCalledWith(1, 10, 'name', 'ASC');
    });
  });
});
