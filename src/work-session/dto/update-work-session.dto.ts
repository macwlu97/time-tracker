import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDate } from 'class-validator';

export class UpdateWorkSessionDto {
  // Optional end time to stop the work session
  @ApiProperty({
    description: 'The end time to mark the end of the work session.',
    required: false, // This field is optional
  })
  @IsOptional()
  @IsDate()
  endTime?: Date;
}
