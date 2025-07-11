import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindOneDto } from './dto/findOne.dto';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateUserDto } from './dto/create.dto';
import { hashPassword } from '@common/utils/hash.util';

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
}
