import { IsString, IsNotEmpty, Matches, ValidateIf } from 'class-validator';

export class ForgetPassDto {
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
}