import { IsString, IsNotEmpty, MinLength, ValidateIf, IsMongoId, IsBoolean, IsPhoneNumber, IsISO8601, IsOptional } from 'class-validator';

export class UserDto {
    @IsMongoId()
    @IsNotEmpty({ message: 'ID is required' })
    id: string;

    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Email is required' })
    @ValidateIf((o) => !o.number)
    email: string;

    @IsString()
    @ValidateIf((o) => !o.number)
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

    @IsString()
    @IsISO8601({ strict: true }, { message: 'DeletedAt must be a valid ISO 8601 date string' })
    @IsOptional()
    deletedAt?: string;

    @IsBoolean()
    @IsOptional()
    isDeleted?: boolean = false;
}