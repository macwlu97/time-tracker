import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Register new user
  async register(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = new User();
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.role = createUserDto.role || 'user'; // Default role 'user'

    return this.userRepository.save(user);
  }

  // Confirm email
  async confirmEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailConfirmed) throw new BadRequestException('Email already confirmed');

    user.isEmailConfirmed = true;
    await this.userRepository.save(user);
    return { message: 'Email confirmed successfully' };
  }

    // Validate user credentials
    async validateUser(email: string, password: string): Promise<User> {

        const user = await this.findByEmail(email);
        

        if (!user) {
        throw new BadRequestException('Invalid credentials');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
        }
    
        return user;
    }
  

    // Find user by email
    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user || null;  // Zamiast rzucać wyjątek, zwróć null, jeśli użytkownik nie istnieje
    }
  

  // Find user by ID (for AuthService)
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
