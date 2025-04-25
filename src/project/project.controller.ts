import { Controller, Post, Body, Get } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('projects') 
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // create project
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ description: 'Name of the project', type: String })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Project name may be invalid.' })
  async create(@Body('name') name: string) {
    return this.projectService.create(name);
  }

  // get all projects
  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of all projects', type: [String] })
  async findAll() {
    return this.projectService.findAll();
  }
}
