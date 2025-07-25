import { IsString, IsNotEmpty, ValidateIf, Matches } from 'class-validator';

export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty({ message: 'OTP is required' })
    otp: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @ValidateIf((o) => !o.email)
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9',
    })
    number: string;
}