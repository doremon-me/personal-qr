import { Body, Controller, Post } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post("createProfile")
    async createProfile(@Body() profileDto: ProfileDto) {
        return this.profileService.createProfile(profileDto);
    }
}
