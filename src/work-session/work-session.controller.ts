import { Controller, Post, Body, UseGuards, Request, Param, Get, Query } from '@nestjs/common';
import { WorkSessionService } from './work-session.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@Controller('work-sessions')
export class WorkSessionController {
  constructor(private readonly workSessionService: WorkSessionService) {}

  // Start work session
  @Post('start')
  @UseGuards(JwtAuthGuard)  // Add JWT guard
  @ApiOperation({ summary: 'Start a work session' })
  @ApiBody({ type: CreateWorkSessionDto, description: 'Details for starting a work session' })
  @ApiResponse({ status: 200, description: 'Work session started successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid or expired JWT token.' })
  @ApiBearerAuth() 
  async startWork(
    @Body() body: CreateWorkSessionDto,  // Only pass the required fields in body
    @Request() req
  ) {
    // Pass the userId from JWT token directly
    const session = await this.workSessionService.startWork(body, req.user.id);
    return {
      message: 'Work session started successfully',
      session,
    };
  }

  // Stop work session
  @Post('stop/:sessionId')
  @UseGuards(JwtAuthGuard)  // Add JWT guard
  @ApiOperation({ summary: 'Stop a work session' })
  @ApiParam({ name: 'sessionId', description: 'ID of the session to stop' })
  @ApiResponse({ status: 200, description: 'Work session stopped successfully.' })
  @ApiResponse({ status: 404, description: 'Work session not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid or expired JWT token.' })
  @ApiBearerAuth() 
  async stopWork(@Param('sessionId') sessionId: number) {
    const session = await this.workSessionService.stopWork(sessionId);
    return {
      message: 'Work session stopped successfully',
      session,
    };
  }

  // Get total work time for the currently logged-in user
  @Get('total-time')
  @UseGuards(JwtAuthGuard)  // JWT Auth Guard
  @ApiOperation({ summary: 'Get total work time for the currently logged-in user' })
  @ApiResponse({ status: 200, description: 'Total work time data for the logged-in user' })
  @ApiBearerAuth() // Add Bearer token for authorization
  async getTotalWorkTime(@Request() req) {
    const userId = req.user.id;  // Extract user ID from JWT token
    return await this.workSessionService.getTotalWorkTimeForLoggedUser(userId);
  }

  // Endpoint for admin to fetch total work time for all users (optionally filter by userId)
  @Get('total-time-all-users')
  @UseGuards(JwtAuthGuard, RolesGuard) // Guard protecting access
  @Roles(Role.Admin) // Only accessible by admins
  @ApiOperation({ summary: 'Get total work time for all users, with optional filtering by userId' })
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter by user ID (optional)' })
  @ApiResponse({ status: 200, description: 'Total work time data for all users or a specific user', type: [Object] })
  @ApiBearerAuth() // Requires JWT token
  async getTotalWorkTimeForAllUsers(@Query('userId') userIdFilter?: number) {
    return this.workSessionService.getTotalWorkTimeForAllUsers(userIdFilter); // Fetch total work time for all users (or a specific one)
  }
}
