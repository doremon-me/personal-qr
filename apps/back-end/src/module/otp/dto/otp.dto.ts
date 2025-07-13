import { IsString, IsNotEmpty, IsISO8601, IsOptional, IsMongoId } from 'class-validator';

export class OtpDto {
    @IsMongoId()
    @IsNotEmpty({ message: 'ID is required and must be a valid MongoDB ObjectId' })
    id: string;

    @IsMongoId()
    @IsNotEmpty({ message: 'User ID is required and must be a valid MongoDB ObjectId' })
    userId: string;

    @IsString()
    @IsNotEmpty({ message: 'OTP is required' })
    otp: string;

    @IsISO8601({}, { message: 'Expiry must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'Expiry date is required' })
    expiry: string;

    @IsString()
    type: string;
}