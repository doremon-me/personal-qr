import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FindOneDto } from './dto/findOne.dto';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateUserDto } from './dto/create.dto';
import { hashPassword } from '@common/utils/hash.util';
import { UserDto } from './dto/user.dto';
import { ProfileDto } from './dto/profile.dto';
import { ProfileType } from '@generated/prisma';
import { AuthPayload } from '@common/token/token.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }
    async findOne(findOneDto: FindOneDto) {
        try {
            return await this.prismaService.user.findFirst({
                where: {
                    AND: [
                        {
                            OR: [
                                { number: findOneDto.number || undefined },
                                { email: findOneDto.email || undefined },
                                { id: findOneDto.id || undefined }
                            ]
                        },
                        { isDeleted: false }
                    ]
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error finding user');
        }
    }

    async createUser(createUserDto: CreateUserDto) {
        try {
            return await this.prismaService.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    number: createUserDto.number,
                    password: await hashPassword(createUserDto.password),
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async updateUser(id: string, updateData: Partial<UserDto>) {
        try {
            return await this.prismaService.user.update({
                where: { id },
                data: {
                    ...updateData,
                    ...(updateData.password && { password: await hashPassword(updateData.password) }),
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error updating user');
        }
    }

    async createProfile(user: AuthPayload, profileData: ProfileDto) {
        const findOneDto = {
            id: user.id,
            email: "",
            number: "",
            validateFields: {
                id: true,
                email: false,
                number: false
            }
        }
        const checkUser = await this.findOne(findOneDto);
        if (!checkUser) throw new NotFoundException('User not found');
        const checkProfile = await this.prismaService.profile.findFirst({
            where: { userId: checkUser.id },
            include: {
                Contacts: true
            }
        });
        if (checkProfile) throw new ConflictException('Profile already exists');
        try {
            return await this.prismaService.profile.create({
                data: {
                    userId: user.id,
                    type: profileData.type,
                    motherName: profileData.motherName,
                    fatherName: profileData.fatherName,
                    ...(profileData.contacts && {
                        Contacts: {
                            create: profileData.contacts.map(contact => ({
                                contactPersonName: contact.contactPersonName,
                                contactPersonNumber: contact.contactPersonNumber,
                            }))
                        }
                    })
                }
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Profile already exists for this user');
            }
            throw new InternalServerErrorException('Error creating profile');
        }
    }

    async updateProfile(user: AuthPayload, updateData: UpdateProfileDto) {
        const findOneDto = {
            id: user.id,
            email: "",
            number: "",
            validateFields: {
                id: true,
                email: false,
                number: false
            }
        }
        const checkUser = await this.findOne(findOneDto);
        if (!checkUser) throw new NotFoundException('User not found');
        const checkProfile = await this.prismaService.profile.findFirst({
            where: { userId: checkUser.id },
            include: {
                Contacts: true
            }
        });
        if (!checkProfile) throw new NotFoundException('Profile not found');

        const contactsToUpdate = (updateData.contacts || []).filter(c => c.id);
        const contactsToCreate = (updateData.contacts || []).filter(c => !c.id);

        try {
            return await this.prismaService.profile.update({
                where: { id: checkProfile.id },
                data: {
                    type: updateData.type || checkProfile.type,
                    motherName: updateData.motherName || checkProfile.motherName,
                    fatherName: updateData.fatherName || checkProfile.fatherName,
                    updatedAt: new Date(),
                    ...(updateData.contacts && {
                        Contacts: {
                            ...(contactsToUpdate.length > 0 && {
                                updateMany: contactsToUpdate.map(contact => ({
                                    where: { id: contact.id },
                                    data: {
                                        contactPersonName: contact.contactPersonName,
                                        contactPersonNumber: contact.contactPersonNumber,
                                    }
                                }))
                            }),
                            ...(contactsToCreate.length > 0 && {
                                create: contactsToCreate.map(contact => ({
                                    contactPersonName: contact.contactPersonName,
                                    contactPersonNumber: contact.contactPersonNumber,
                                }))
                            })
                        }
                    })
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error updating profile');
        }
    }

    async fetchProfile(user: AuthPayload) {
        const findOneDto = {
            id: user.id,
            email: "",
            number: "",
            validateFields: {
                id: true,
                email: false,
                number: false
            }
        }
        const checkUser = await this.findOne(findOneDto);
        if (!checkUser) throw new NotFoundException('User not found');
        const profile = await this.prismaService.profile.findFirst({
            where: { userId: checkUser.id },
            include: {
                Contacts: true
            }
        });
        if (!profile) throw new NotFoundException('Profile not found');
        return profile;
    }

    async deleteUser(user: AuthPayload) {
        const findOneDto = {
            id: user.id,
            email: "",
            number: "",
            validateFields: {
                id: true,
                email: false,
                number: false
            }
        };
        const checkUser = await this.findOne(findOneDto);
        if (!checkUser) throw new NotFoundException('User not found');

        const profile = await this.prismaService.profile.findFirst({
            where: { userId: checkUser.id }
        });

        try {
            if (profile) {
                await this.prismaService.contacts.deleteMany({
                    where: { profileId: profile.id }
                });
                await this.prismaService.profile.delete({
                    where: { id: profile.id }
                });
            }
            await this.prismaService.user.delete({
                where: { id: checkUser.id }
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error deleting user and related data');
        }
    }
}
