import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateWorkSessionDto {
  // Description of the task the user is working on
  @IsString()
  @IsNotEmpty()
  description: string;

  // Project ID that the user is working on
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  // Optional start time (we can set this by default in the service if not provided)
  @IsOptional()
  startTime?: Date;
}
