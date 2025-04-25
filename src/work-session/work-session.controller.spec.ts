import { Test, TestingModule } from '@nestjs/testing';
import { WorkSessionController } from './work-session.controller';
import { WorkSessionService } from './work-session.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';

describe('WorkSessionController', () => {
  let controller: WorkSessionController;
  let service: WorkSessionService;

  // Mocking the WorkSessionService
  const mockWorkSessionService = {
    startWork: jest.fn(),
    stopWork: jest.fn(),
    getTotalWorkTimeForLoggedUser: jest.fn(),
    getTotalWorkTimeForAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSessionController],
      providers: [
        {
          provide: WorkSessionService,
          useValue: mockWorkSessionService,
        },
      ],
    }).compile();

    controller = module.get<WorkSessionController>(WorkSessionController);
    service = module.get<WorkSessionService>(WorkSessionService);
  });

  describe('startWork', () => {
    it('should start a work session successfully', async () => {
      const mockBody = { projectId: 1, description: 'Test project' };
      const mockRequest = { user: { id: 1 } };
      const mockSession = { id: 1, startTime: new Date(), ...mockBody };

      mockWorkSessionService.startWork.mockResolvedValue(mockSession);

      const result = await controller.startWork(mockBody, mockRequest as any);
      expect(result.message).toBe('Work session started successfully');
      expect(result.session).toEqual(mockSession);
      expect(mockWorkSessionService.startWork).toHaveBeenCalledWith(mockBody, 1);
    });
  });

  describe('stopWork', () => {
    it('should stop a session by setting endTime', async () => {
      const mockSession = { id: 1, endTime: null } as any;
      const mockRequest = { user: { id: 1 } };

      mockWorkSessionService.stopWork.mockResolvedValue({
        ...mockSession,
        endTime: new Date(),
      });

      const result = await controller.stopWork(1);
      expect(result.message).toBe('Work session stopped successfully');
      expect(result.session.endTime).toBeInstanceOf(Date);
      expect(mockWorkSessionService.stopWork).toHaveBeenCalledWith(1);
    });

    it('should throw error if session not found', async () => {
      mockWorkSessionService.stopWork.mockRejectedValue(new Error('Work session not found'));

      try {
        await controller.stopWork(1);
      } catch (e) {
        expect(e.response.message).toBe('Work session not found');
      }
    });
  });

  describe('getTotalWorkTime', () => {
    it('should return total work time for the logged-in user', async () => {
      const mockRequest = { user: { id: 1 } };
      const mockData = { totalWorkTimeByDay: [{ day: '2025-04-25', totalWorkTimeInHours: 8 }] };

      mockWorkSessionService.getTotalWorkTimeForLoggedUser.mockResolvedValue(mockData);

      const result = await controller.getTotalWorkTime(mockRequest as any);
      expect(result.totalWorkTimeByDay).toEqual(mockData.totalWorkTimeByDay);
      expect(mockWorkSessionService.getTotalWorkTimeForLoggedUser).toHaveBeenCalledWith(1);
    });
  });

  describe('getTotalWorkTimeForAllUsers', () => {
    it('should return total work time for all users', async () => {
      const mockQuery = { userId: 1 };
      const mockData = [
        {
          userId: 1,
          email: 'user1@test.com',
          workSummary: [{ day: '2025-04-25', totalWorkTimeInHours: 8 }],
        },
      ];

      mockWorkSessionService.getTotalWorkTimeForAllUsers.mockResolvedValue(mockData);

      const result = await controller.getTotalWorkTimeForAllUsers(mockQuery.userId);
      expect(result).toEqual(mockData);
      expect(mockWorkSessionService.getTotalWorkTimeForAllUsers).toHaveBeenCalledWith(1);
    });

    it('should return total work time for all users without filtering', async () => {
      const mockData = [
        {
          userId: 1,
          email: 'user1@test.com',
          workSummary: [{ day: '2025-04-25', totalWorkTimeInHours: 8 }],
        },
      ];

      mockWorkSessionService.getTotalWorkTimeForAllUsers.mockResolvedValue(mockData);

      const result = await controller.getTotalWorkTimeForAllUsers(undefined);
      expect(result).toEqual(mockData);
      expect(mockWorkSessionService.getTotalWorkTimeForAllUsers).toHaveBeenCalledWith(undefined);
    });
  });
});
