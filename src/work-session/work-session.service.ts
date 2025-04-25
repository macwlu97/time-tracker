import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkSession } from './work-session.entity';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

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

  // Get total work time for a user
  async getTotalWorkTimeForUser(userId: number): Promise<any> {
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

    // Prepare response data in hours
    const totalWorkTimeByDay = Object.keys(workTimesPerDay).map((day) => ({
      day,
      totalWorkTimeInHours: workTimesPerDay[day] / (1000 * 3600), // Convert to hours
    }));

    return { totalWorkTimeByDay };
  }
}
