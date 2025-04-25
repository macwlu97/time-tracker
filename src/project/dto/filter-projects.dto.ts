import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterProjectsDto {
  // Optional filter by project name
  @ApiProperty({
    description: 'Optional filter by project name',
    example: 'Sample Project',  // Default value shown in Swagger UI
    required: false,  // Indicates that this property is optional
  })
  @IsString()
  @IsOptional()
  name?: string;
}
