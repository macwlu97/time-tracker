import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  // The project name should be a non-empty string
  @ApiProperty({
    description: 'The name of the project',
    example: 'New Project',  // Default value shown in Swagger UI
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
