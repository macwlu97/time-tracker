import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects') 
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // create project
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ description: 'Details of the project to be created', type: CreateProjectDto }) // Use DTO for request body
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Project name may be invalid.' })
  @ApiBearerAuth()
  async create(@Body() createProjectDto: CreateProjectDto) { // Use the DTO in the method signature
    return this.projectService.create(createProjectDto.name); // Pass the project name from the DTO
  }

  // get list of projects with pagination
  @Get()
  @ApiOperation({ summary: 'Get all projects with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'ASC' })
  @ApiResponse({ status: 200, description: 'List of projects with pagination' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.projectService.findAll(page, limit, sortBy, sortOrder);
  }
}
