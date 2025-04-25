import { IsOptional, IsString } from 'class-validator';

export class FilterProjectsDto {
  // Optional filter by project name
  @IsString()
  @IsOptional()
  name?: string;
}
