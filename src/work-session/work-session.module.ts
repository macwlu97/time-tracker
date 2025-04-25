import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkSessionService } from './work-session.service';
import { WorkSessionController } from './work-session.controller';
import { WorkSession } from './work-session.entity';
import { UserModule } from '../user/user.module';  // Import UserModule
import { ProjectModule } from '../project/project.module'; // Assuming you have a ProjectModule

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkSession]), // Import WorkSession repository
    UserModule,  // Import UserModule to access UserRepository
    ProjectModule, // Import ProjectModule to access ProjectRepository
  ],
  controllers: [WorkSessionController],
  providers: [WorkSessionService],
})
export class WorkSessionModule {}

