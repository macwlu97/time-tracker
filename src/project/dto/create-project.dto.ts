import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  // The project name should be a non-empty string
  @IsString()
  @IsNotEmpty()
  name: string;
}
