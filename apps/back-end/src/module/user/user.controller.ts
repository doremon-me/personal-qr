import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuth } from '@common/decorators/userAuth.decorator';
import { AuthPayload, VerifiedPayload } from '@common/token/token.service';
import { ProfileDto } from './dto/profile.dto';
import { VerifiedInfo } from '@common/decorators/verified.decorator';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserSerializer } from './user.serilizer';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { VerifyDto } from './dto/verify.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, @InjectQueue('sms-queue') private smsQueue: Queue) { }

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

        const userProfile = await this.userService.updateProfile(user, updateProfileDto);
        return plainToInstance(UserSerializer, userProfile, { excludeExtraneousValues: true })
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
        return plainToInstance(UserSerializer, profileInfo, { excludeExtraneousValues: true })
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

    @Post(":id")
    async getUser(@Body() body: VerifyDto, @Param('id') id: string) {
        const { number } = body;
        const user = await this.userService.getUserById(id);
    }
}
