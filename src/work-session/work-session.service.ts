import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkSession } from './work-session.entity';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

type WorkSummaryPerUser = {
  userId: number;
  email: string;
  workSummary: {
    day: string;
    totalWorkTimeInHours: number;
  }[];
};

@Injectable()
export class WorkSessionService {
  constructor(
    @InjectRepository(WorkSession)
    private readonly workSessionRepository: Repository<WorkSession>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  // Inject UserRepository
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,  // Inject ProjectRepository
  ) {}

  // Start work session
  async startWork(createWorkSessionDto: CreateWorkSessionDto, userId: number): Promise<WorkSession> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const project = await this.projectRepository.findOne({
      where: { id: createWorkSessionDto.projectId },
    });
  
    if (!user || !project) {
      throw new HttpException('User or project not found', HttpStatus.BAD_REQUEST);
    }
  
    const workSession = new WorkSession();
    workSession.startTime = new Date();
    workSession.description = createWorkSessionDto.description;
    workSession.project = project;
    workSession.user = user;
  
    try {
      return await this.workSessionRepository.save(workSession);
    } catch (error) {
      throw new HttpException('Error starting work session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  // Stop work session
  async stopWork(sessionId: number): Promise<WorkSession> {
    const session = await this.workSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new HttpException('Work session not found', HttpStatus.NOT_FOUND);
    }

    // Ensure session is not already stopped
    if (session.endTime) {
      throw new HttpException('Work session already stopped', HttpStatus.BAD_REQUEST);
    }

    session.endTime = new Date();
    try {
      return await this.workSessionRepository.save(session);
    } catch (error) {
      throw new HttpException('Error stopping work session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    // Get total work time for the currently logged-in user
    async getTotalWorkTimeForLoggedUser(userId: number): Promise<any> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['sessions'], // loading session relations
      });
    
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    
      // Aggregate work time for user and calculate total time per day
      const workTimesPerDay = {};
      user.sessions.forEach((session) => {
        if (session.endTime) {
          const day = session.startTime.toISOString().split('T')[0]; // YYYY-MM-DD format
          const workDuration = session.endTime.getTime() - session.startTime.getTime();
    
          if (!workTimesPerDay[day]) {
            workTimesPerDay[day] = 0;
          }
    
          workTimesPerDay[day] += workDuration; // Accumulating the work time for the day
        }
      });
    
      // Prepare response data in hours for the chart (with up to 2 decimal places)
      const totalWorkTimeByDay = Object.keys(workTimesPerDay).map((day) => ({
        day,
        totalWorkTimeInHours: parseFloat((workTimesPerDay[day] / (1000 * 3600)).toFixed(2)), // Convert to hours and limit to 2 decimals
      }));
    
      return { totalWorkTimeByDay };
    }
    
    // Get total work time for all user
    async getTotalWorkTimeForAllUsers(userIdFilter?: number) {
      // Fetch users with their sessions, apply filter if userId is provided
      const users = await this.userRepository.find({
        relations: ['sessions'],
        where: userIdFilter ? { id: userIdFilter } : {}, // Filter by userId if passed
      });
    
      type WorkSummaryPerUser = {
        userId: number;
        email: string;
        workSummary: {
          day: string; // Date in 'YYYY-MM-DD' format
          totalWorkTimeInHours: number; // Work time in hours
        }[];
      };
    
      const result: WorkSummaryPerUser[] = [];
    
      // Process each user's work sessions
      for (const user of users) {
        const workTimesPerDay: Record<string, number> = {};
    
        // Process each session for the user
        user.sessions.forEach((session) => {
          if (session.endTime) {
            const day = session.startTime.toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD' format
            const duration = session.endTime.getTime() - session.startTime.getTime(); // Calculate duration of the session
    
            if (!workTimesPerDay[day]) {
              workTimesPerDay[day] = 0;
            }
    
            workTimesPerDay[day] += duration; // Accumulate work time for each day
          }
        });
    
        // Prepare the response for the user
        result.push({
          userId: user.id,
          email: user.email,
          workSummary: Object.entries(workTimesPerDay).map(([day, duration]) => ({
            day, // Date of the session
            totalWorkTimeInHours: parseFloat((duration / (1000 * 3600)).toFixed(2)), // Convert milliseconds to hours and round to two decimal places
          })),
        });
      }
    
      return result; // Return the result for all users
    }

}
