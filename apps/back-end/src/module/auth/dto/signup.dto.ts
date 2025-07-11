import { IsString, IsNotEmpty, MinLength, Matches, ValidateIf } from 'class-validator';

export class UserSignupDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Email is required' })
    @ValidateIf((o) => !o.number)
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @ValidateIf((o) => !o.email)
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9',
    })
    number: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}