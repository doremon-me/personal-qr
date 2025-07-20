import { IsString, IsOptional, IsEnum, ValidateNested, IsArray, IsNotEmpty, ValidateIf, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProfileType {
    PUBLIC = 'PUBLIC',
    EMERGENCY = 'EMERGENCY',
}

export class ContactsDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    contactPersonName: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @ValidateIf((o) => !o.email)
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9',
    })
    contactPersonNumber: string;
}

export class ProfileDto {
    @IsEnum(ProfileType)
    @IsOptional()
    type: ProfileType = ProfileType.PUBLIC;

    @IsString()
    @IsOptional()
    motherName?: string;

    @IsString()
    @IsOptional()
    fatherName?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactsDto)
    @IsOptional()
    contacts?: ContactsDto[];
}