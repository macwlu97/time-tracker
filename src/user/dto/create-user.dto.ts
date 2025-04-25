import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@example.com',  // Default value shown in Swagger UI
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',  // Default value shown in Swagger UI
    minLength: 6,  // Displayed in Swagger UI as validation rule
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',  // Default value shown in Swagger UI
    enum: ['user', 'admin'],  // Possible roles displayed in Swagger UI
  })
  @IsString()
  role: 'user' | 'admin';
}
