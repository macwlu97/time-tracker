import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { WorkSessionService } from './work-session.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

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
  async stopWork(@Param('sessionId') sessionId: number) {
    const session = await this.workSessionService.stopWork(sessionId);
    return {
      message: 'Work session stopped successfully',
      session,
    };
  }
}
