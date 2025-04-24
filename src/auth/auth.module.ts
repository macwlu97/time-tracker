import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
          }),
          inject: [ConfigService],
    }),
    forwardRef(() => UserModule), // If you need UserModule in AuthModule
  ],
  providers: [],
  exports: [JwtModule],
})
export class AuthModule {}
