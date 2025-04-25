import { IsEmail, IsString, Length, validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should be valid when all fields are correct', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.password = 'strongpassword';
    dto.role = 'user';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is missing', async () => {
    const dto = new CreateUserDto();
    dto.password = 'strongpassword';
    dto.role = 'user';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
