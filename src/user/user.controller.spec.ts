import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let authService: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
    register: jest.fn(),
    confirmEmail: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedpassword',
    role: 'user',
    isEmailConfirmed: false,
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: 'password', role: 'user' };
      mockUserService.findByEmail.mockResolvedValue(null); // No user found
      mockUserService.register.mockResolvedValue(mockUser);

      const result = await userController.register(createUserDto);

      expect(result.message).toBe('User registered successfully. Confirm email via link.');
      expect(result.confirmationLink).toBe(`/users/confirm?email=${mockUser.email}`);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUserService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: 'password', role: 'user' };
      mockUserService.findByEmail.mockResolvedValue(mockUser); // User already exists

      await expect(userController.register(createUserDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('confirmEmail', () => {
    it('should confirm the email successfully', async () => {
      const email = 'test@test.com';
      mockUserService.confirmEmail.mockResolvedValue({ message: 'Email confirmed successfully' });

      const result = await userController.confirmEmail(email);

      expect(result.message).toBe('Email confirmed successfully');
      expect(mockUserService.confirmEmail).toHaveBeenCalledWith(email);
    });

    it('should throw an error if user not found', async () => {
      const email = 'test@test.com';
      mockUserService.confirmEmail.mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.confirmEmail(email)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('login', () => {
    it('should successfully log in and return a JWT', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@test.com', password: 'password' };
      const mockJwt = 'mock-jwt-token';
      mockUserService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue({ access_token: mockJwt });

      const result = await userController.login(loginUserDto);

      expect(result.access_token).toBe(mockJwt);
      expect(mockUserService.validateUser).toHaveBeenCalledWith(loginUserDto.email, loginUserDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@test.com', password: 'wrongpassword' };
      mockUserService.validateUser.mockResolvedValue(null); // Invalid user credentials

      await expect(userController.login(loginUserDto)).rejects.toThrowError(UnauthorizedException);
    });
  });
});
