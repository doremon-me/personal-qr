import { IsString } from 'class-validator';
import { PartialType, PickType, IntersectionType } from '@nestjs/mapped-types';
import { ProfileDto } from './profile.dto';
import { UserDto } from './user.dto';

export class UpdateProfileDto extends IntersectionType(
    PartialType(PickType(UserDto, ['name', 'email', 'number'] as const)),
    PartialType(ProfileDto),
) {
    @IsString()
    id: string;
}