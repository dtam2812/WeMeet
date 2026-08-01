import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Email must be filled' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password must be filled' })
  password: string;
}
