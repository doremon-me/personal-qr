import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuth } from '@common/decorators/userAuth.decorator';
import { AuthPayload, VerifiedPayload } from '@common/token/token.service';
import { ProfileDto } from './dto/profile.dto';
import { VerifiedInfo } from '@common/decorators/verified.decorator';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserSerializer } from './user.serilizer';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("createProfile")
    async createProfile(@VerifiedInfo() verifiedInfo: VerifiedPayload, @UserAuth() user: AuthPayload, @Body() createProfileDto: ProfileDto) {
        if (!verifiedInfo) {
            throw new UnauthorizedException("User not verified");
        }

        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        return await this.userService.createProfile(user, createProfileDto);
    }

    @Patch("updateProfile")
    async updateProfile(@VerifiedInfo() verifiedInfo: VerifiedPayload, @UserAuth() user: AuthPayload, @Body() updateProfileDto: UpdateProfileDto) {
        if (!verifiedInfo) {
            throw new UnauthorizedException("User not verified");
        }
        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        return await this.userService.updateProfile(user, updateProfileDto);
    }

    @Get("fetchProfile")
    async fetchProfile(@VerifiedInfo() verifiedInfo: VerifiedPayload, @UserAuth() user: AuthPayload) {
        if (!verifiedInfo) {
            throw new UnauthorizedException("User not verified");
        }

        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        const profileInfo = await this.userService.fetchProfile(user);
        return plainToInstance(UserSerializer, {
            id: profileInfo.user.id,
            profileId: profileInfo.profile.id,
            name: profileInfo.user.name,
            email: profileInfo.user.email,
            number: profileInfo.user.number,
            fatherName: profileInfo.profile.fatherName,
            motherName: profileInfo.profile.motherName,
            Contacts: profileInfo.profile.Contacts.map(contact => ({
                id: contact.id,
                contactPersonName: contact.contactPersonName,
                contactPersonNumber: contact.contactPersonNumber
            }))
        }, { excludeExtraneousValues: true })
    }

    @Delete("delete")
    async deleteUser(@VerifiedInfo() verifiedInfo: VerifiedPayload, @UserAuth() user: AuthPayload, @Res() res: Response) {
        if (!verifiedInfo) {
            throw new UnauthorizedException("User not verified");
        }

        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        res.clearCookie("__user_access");
        res.clearCookie("__verified");

        return await this.userService.deleteUser(user);
    }
}
