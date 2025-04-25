import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsIn } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',  // Default value shown in Swagger UI
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'password123',  // Default value shown in Swagger UI
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',  // Default value shown in Swagger UI
    enum: ['user', 'admin'],  // Enums allow for a restricted set of valid values
  })
  @IsIn(['user', 'admin'])
  role: 'user' | 'admin';
}
