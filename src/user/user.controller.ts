import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint do rejestracji użytkownika
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // Endpoint do logowania
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  // Endpoint do potwierdzenia emaila
  @Post('confirm-email/:userId')
  async confirmEmail(@Param('userId') userId: number) {
    return this.userService.confirmEmail(userId);
  }
}
