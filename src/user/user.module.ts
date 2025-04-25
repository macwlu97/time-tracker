import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]), // Importing UserRepository
//     forwardRef(() => AuthModule), // If you need AuthModule in UserModule (for JWT login)
//   ],
//   controllers: [UserController],
//   providers: [UserService],
//   exports: [UserService], // Export UserService for other modules
// })
// export class UserModule {}


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],  // Import User entity repository
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],  // Export UserService and TypeOrmModule for other modules to use
})
export class UserModule {}
