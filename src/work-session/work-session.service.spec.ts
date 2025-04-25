import { Test, TestingModule } from '@nestjs/testing';
import { WorkSessionService } from './work-session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkSession } from './work-session.entity';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('WorkSessionService', () => {
  let service: WorkSessionService;
  let workSessionRepositoryMock: any;
  let userRepositoryMock: any;
  let projectRepositoryMock: any;

  beforeEach(async () => {
    workSessionRepositoryMock = {
      save: jest.fn(),
      findOne: jest.fn(),
    };
    userRepositoryMock = {
      findOne: jest.fn(),
    };
    projectRepositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkSessionService,
        {
          provide: getRepositoryToken(WorkSession),
          useValue: workSessionRepositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: projectRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<WorkSessionService>(WorkSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startWork', () => {
    it('should start a work session successfully', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      const project = { id: 1, name: 'Test Project' } as Project;
      const createWorkSessionDto = { description: 'Work Description', projectId: 1 };

      userRepositoryMock.findOne.mockResolvedValue(user);
      projectRepositoryMock.findOne.mockResolvedValue(project);
      workSessionRepositoryMock.save.mockResolvedValue({ ...createWorkSessionDto, startTime: new Date(), user, project });

      const result = await service.startWork(createWorkSessionDto, user.id);

      expect(result).toHaveProperty('startTime');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(user.email);
      expect(result.project.name).toBe(project.name);
      expect(workSessionRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user or project not found', async () => {
      const createWorkSessionDto = { description: 'Work Description', projectId: 1 };
      userRepositoryMock.findOne.mockResolvedValue(null); // Simulate user not found
      projectRepositoryMock.findOne.mockResolvedValue(null); // Simulate project not found

      await expect(service.startWork(createWorkSessionDto, 1)).rejects.toThrowError(
        new HttpException('User or project not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('stopWork', () => {
    it('should stop a work session successfully', async () => {
      const session = { id: 1, startTime: new Date(), endTime: null } as unknown as WorkSession;
      workSessionRepositoryMock.findOne.mockResolvedValue(session);
      workSessionRepositoryMock.save.mockResolvedValue({ ...session, endTime: new Date() });

      const result = await service.stopWork(1);

      expect(result.endTime).toBeDefined();
      expect(workSessionRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if session not found', async () => {
      workSessionRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.stopWork(1)).rejects.toThrowError(
        new HttpException('Work session not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw error if session is already stopped', async () => {
      const session = { id: 1, startTime: new Date(), endTime: new Date() } as WorkSession;
      workSessionRepositoryMock.findOne.mockResolvedValue(session);

      await expect(service.stopWork(1)).rejects.toThrowError(
        new HttpException('Work session already stopped', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getTotalWorkTimeForLoggedUser', () => {
    it('should return total work time for the logged-in user', async () => {
      const user = { id: 1, email: 'test@example.com', sessions: [{ startTime: new Date(), endTime: new Date(new Date().getTime() + 3600000) }] } as User;

      userRepositoryMock.findOne.mockResolvedValue(user);

      const result = await service.getTotalWorkTimeForLoggedUser(user.id);

      expect(result.totalWorkTimeByDay).toBeDefined();
      expect(result.totalWorkTimeByDay.length).toBeGreaterThan(0);
    });

    it('should throw an error if user not found', async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.getTotalWorkTimeForLoggedUser(1)).rejects.toThrowError(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getTotalWorkTimeForAllUsers', () => {
    it('should return total work time for all users', async () => {
      const users = [
        {
          id: 1,
          email: 'test@example.com',
          sessions: [
            { startTime: new Date(), endTime: new Date(new Date().getTime() + 3600000) },
          ],
        },
      ];

      userRepositoryMock.find.mockResolvedValue(users);

      const result = await service.getTotalWorkTimeForAllUsers();

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(1);
      expect(result[0].workSummary).toHaveLength(1);
    });
  });
});
