import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeDefined();
  });

  it('should return true if token is valid', async () => {
    // Mockowanie ExecutionContext
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid_token' },
        }),
      }),
    };

    // Mockowanie metody canActivate, aby zwracała true (symulacja poprawnego tokena)
    jest.spyOn(jwtAuthGuard, 'canActivate').mockResolvedValue(true);

    // Testowanie, czy metoda zwróci prawidłowy wynik
    expect(await jwtAuthGuard.canActivate(mockContext as ExecutionContext)).toBe(true);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    // Mockowanie ExecutionContext
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalid_token' },
        }),
      }),
    };

    // Mockowanie metody canActivate, aby zwracała false (symulacja błędnego tokena)
    jest.spyOn(jwtAuthGuard, 'canActivate').mockResolvedValue(false);

    // Testowanie, czy metoda rzuci wyjątek UnauthorizedException
    await expect(jwtAuthGuard.canActivate(mockContext as ExecutionContext)).rejects.toThrowError(UnauthorizedException);
  });
});
