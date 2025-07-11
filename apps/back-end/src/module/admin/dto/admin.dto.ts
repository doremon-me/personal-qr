import { IsString, IsNotEmpty, MinLength, IsMongoId, IsPhoneNumber, IsISO8601, IsOptional } from 'class-validator';

export class AdminDto {
    @IsMongoId()
    @IsNotEmpty({ message: 'ID is required' })
    id: string;

    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @MinLength(2, { message: 'First name must be at least 2 characters long' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @MinLength(2, { message: 'Last name must be at least 2 characters long' })
    lastName: string;

    @IsString()
    @IsPhoneNumber('IN', { message: 'Please enter a valid phone number' })
    number: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsISO8601({ strict: true }, { message: 'CreatedAt must be a valid ISO 8601 date string' })
    createdAt: string;

    @IsString()
    @IsISO8601({ strict: true }, { message: 'UpdatedAt must be a valid ISO 8601 date string' })
    @IsOptional()
    updatedAt?: string;
}