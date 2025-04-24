import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt'; // Importing JwtModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Importing UserRepository
    forwardRef(() => AuthModule), 
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exporting UserService if you want to use it in other modules
})
export class UserModule {}
