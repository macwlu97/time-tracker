import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule, // Enabling passport for authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Secret key for JWT
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }, // Token expiration
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule), // Handle circular dependency with UserModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
