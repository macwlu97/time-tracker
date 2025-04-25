import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateWorkSessionDto {
  // Description of the task the user is working on
  @ApiProperty({
    description: 'The task description that the user is working on.',
    example: 'Working on project tasks',  // Default value shown in Swagger UI
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  // Project ID that the user is working on
  @ApiProperty({
    description: 'The ID of the project the user is working on.',
    example: 1,  // Default value shown in Swagger UI
  })
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  // Optional start time (we can set this by default in the service if not provided)
  @ApiProperty({
    description: 'Optional start time of the work session. If not provided, the server can set this by default.',
    required: false,  // This field is optional
  })
  @IsOptional()
  startTime?: Date;
}
