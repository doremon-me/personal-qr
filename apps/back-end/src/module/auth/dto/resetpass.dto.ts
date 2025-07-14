import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPassDto {
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}