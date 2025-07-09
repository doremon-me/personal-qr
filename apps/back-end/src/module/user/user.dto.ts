import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'First name should be a string' })
  @Length(3, 20, {
    message: 'First name should be between 3 and 20 characters',
  })
  firstName: string;

  @IsString({ message: 'Last name should be a string' })
  @Length(3, 20, {
    message: 'Last name should be between 3 and 20 characters',
  })
  lastName: string;

  @IsString({ message: 'Email should be a string' })
  email: string;

  @IsString({ message: 'Password should be a string' })
  @Length(6, 20, {
    message: 'Password should be between 6 and 20 characters',
  })
  password: string;

  @IsString({ message: 'WP number should be a string' })
  @Length(10, 10, {
    message: 'Whatsapp number should be 10 characters',
  })
  wpNumber: string;

  @IsArray({ message: 'Profile ids should be an array' })
  @IsOptional()
  profileIds: string[];
}
