import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtAuthGuard extends Passport's AuthGuard and validates the JWT token from incoming requests
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
