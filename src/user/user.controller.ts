import { Controller, Post, Body, Get, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BadRequestException as SwaggerBadRequestException, UnauthorizedException as SwaggerUnauthorizedException } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // Register user and return confirmation link
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto, description: 'User registration details' })
  @ApiResponse({ status: 201, description: 'User registered successfully. Confirmation link is returned.' })
  @ApiResponse({ status: 400, description: 'User with this email already exists.' })
  async register(@Body() createUserDto: CreateUserDto) {
    // Check if the email already exists
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // If user doesn't exist, register them
    const user = await this.userService.register(createUserDto);

    // Simulate sending confirmation email (this should be done with an actual service in production)
    const confirmationLink = `/users/confirm?email=${user.email}`;
    
    return {
      message: 'User registered successfully. Confirm email via link.',
      confirmationLink,
    };
  }

  // Confirm email address (dummy - no email sent)
  @Get('confirm')
  @ApiOperation({ summary: 'Confirm user email address' })
  @ApiResponse({ status: 200, description: 'Email confirmed successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async confirmEmail(@Query('email') email: string) {
    return this.userService.confirmEmail(email);
  }

  // Login and return JWT
  @Post('login')
  @ApiOperation({ summary: 'Login and obtain JWT token' })
  @ApiBody({ type: LoginUserDto, description: 'Login credentials (email and password)' })
  @ApiResponse({ status: 200, description: 'Login successful. JWT token returned.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);

    // If the user doesn't exist or credentials are invalid
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If credentials are correct, generate and return the JWT
    return this.authService.login(user);
  }
}
