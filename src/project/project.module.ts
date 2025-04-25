import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],  // Make sure ProjectRepository is available
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [TypeOrmModule],  // Export TypeOrmModule so that other modules can use ProjectRepository
})
export class ProjectModule {}
