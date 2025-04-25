import { IsInt, IsOptional, IsDate } from 'class-validator';

export class UpdateWorkSessionDto {
  // Optional end time to stop the work session
  @IsInt()
  @IsOptional()
  endTime?: Date;
}
