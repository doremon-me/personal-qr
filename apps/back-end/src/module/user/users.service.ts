import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async createUser(user: CreateUserDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: user.email }, { wpNumber: user.wpNumber }],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User already exists with this email or Number',
      );
    }

    try {
      const newUser = await this.prismaService.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          wpNumber: user.wpNumber,
          profileIds: user.profileIds,
        },
      });
      return newUser;
    } catch (error) {
      throw new Error('something went wrong', error);
    }
  }
}
