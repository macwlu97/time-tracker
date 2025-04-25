import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
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
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: 'password', role: 'user' };
      mockUserRepository.findOne.mockResolvedValue(null); // No existing user

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, password: hashedPassword });

      const result = await service.register(createUserDto);

      expect(result.email).toBe(createUserDto.email);
      expect(result.password).not.toBe(createUserDto.password); // Password should be hashed
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if email is already taken', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: 'password', role: 'user' };
      mockUserRepository.findOne.mockResolvedValue(mockUser); // User already exists

      await expect(service.register(createUserDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('confirmEmail', () => {
    it('should confirm the email successfully', async () => {
      const email = 'test@test.com';
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser, isEmailConfirmed: false });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, isEmailConfirmed: true });

      const result = await service.confirmEmail(email);

      expect(result.message).toBe('Email confirmed successfully');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
      const email = 'test@test.com';
      mockUserRepository.findOne.mockResolvedValue(null); // User does not exist

      await expect(service.confirmEmail(email)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an error if email is already confirmed', async () => {
      const email = 'test@test.com';
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser, isEmailConfirmed: true });

      await expect(service.confirmEmail(email)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const user = { ...mockUser, password: await bcrypt.hash(password, 10) };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.validateUser(email, password);

      expect(result).toBe(user);
    });

    it('should throw an error if user is not found', async () => {
      const email = 'test@test.com';
      const password = 'password';
      mockUserRepository.findOne.mockResolvedValue(null); // User not found

      await expect(service.validateUser(email, password)).rejects.toThrowError(BadRequestException);
    });

    it('should throw an error if password is invalid', async () => {
      const email = 'test@test.com';
      const password = 'wrongpassword';
      const user = { ...mockUser, password: await bcrypt.hash('password', 10) };
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.validateUser(email, password)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@test.com';
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(result).toBe(mockUser);
    });

    it('should return null if user is not found', async () => {
      const email = 'test@test.com';
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const id = 1;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(id);

      expect(result).toBe(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const id = 1;
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrowError(NotFoundException);
    });
  });
});
