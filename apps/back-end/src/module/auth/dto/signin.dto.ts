import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class AdminSigninDto {
    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9',
    })
    number: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}