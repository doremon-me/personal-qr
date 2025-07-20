import { IsString, IsOptional, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProfileType {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

export class ContactsDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    contactPersonName: string;

    @IsString()
    contactPersonNumber: string;
}

export class ProfileDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    userId: string;

    @IsEnum(ProfileType)
    @IsOptional()
    type?: ProfileType;

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
    Contacts?: ContactsDto[];
}