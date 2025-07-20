import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContactsDto, ProfileDto, ProfileType } from './dto/profile.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly prismaService: PrismaService) { }

    async createProfile(profileDto: ProfileDto) {
        try {
            const profile = await this.prismaService.profile.create({
                data: {
                    userId: profileDto.userId,
                    fatherName: profileDto.fatherName,
                    motherName: profileDto.motherName,
                    type: "EMERGENCY",
                    Contacts: {
                        create: profileDto.Contacts?.map((contact: ContactsDto) => ({
                            contactPersonName: contact.contactPersonName,
                            contactPersonNumber: contact.contactPersonNumber,
                        }))
                    }
                }
            });
            return profile;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create profile');
        }
    }
}
