import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './user.dto';
import { SearchAndPaginationDto } from 'src/common/dtos/searchAndPage.dto';
import { hashPassword } from 'src/common/utils/hash.util';
import { updateUserDto } from './updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(quary: SearchAndPaginationDto) {
    const { search, page = 1, limit = 10, orderBy, orderDirection } = quary;

    try {
      if (!search || search.trim() === '') {
        return this.prismaService.user.findMany({
          where: {
            isDeleted: false,
          },
          orderBy: {
            [orderBy]: orderDirection,
          },
          skip: (page - 1) * limit,
          take: limit,
        });
      }
      return this.prismaService.user.findMany({
        where: {
          isDeleted: false,
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { wpNumber: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      throw new BadRequestException('something went wrong', error);
    }
  }

  async find(params: { id?: string; email?: string; phone?: string }) {
    const { id, email, phone } = params;

    if (!id && !email && !phone) {
      throw new BadRequestException('No identifier provided');
    }

    const orConditions: any[] = [];

    if (id && /^[a-f\d]{24}$/i.test(id)) {
      orConditions.push({ id });
    }

    if (email) {
      orConditions.push({ email });
    }

    if (phone) {
      orConditions.push({ wpNumber: phone });
    }

    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          isDeleted: false,
          OR: orConditions,
        },
      });

      return user || null;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Unable to retrieve user',
        cause: error,
        description: error?.message,
      });
    }
  }

  async createUser(user: CreateUserDto) {

    const existingUser = await this.find({
      email: user.email,
      phone: user.wpNumber,
    });

    if (existingUser) {
      throw new BadRequestException(
        'User already exists with this email or Number',
      );
    }

    try {
      const hashedPassword = await hashPassword(user.password);
      const newUser = await this.prismaService.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: hashedPassword,
          wpNumber: user.wpNumber,
          profileIds: user.profileIds,
        },
      });
      return newUser;
    } catch (error) {
      throw new BadRequestException({
        message: 'Something went wrong while creating user',
        cause: error,
        description: error?.message,
      });
    }
  }

  async updateUser(user: updateUserDto, id: string) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    const existUser = await this.prismaService.user.findUnique({
      where: { id: id, isDeleted: true },
    });

    if (!existUser) {
      throw new BadRequestException('user not exist with this id');
    }

    try {
      let hashedPassword: string | undefined;

      if (user.password) {
        hashedPassword = await hashPassword(user.password);
      }

      const updateeUser = await this.prismaService.user.update({
        where: { id: id },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: hashedPassword,
          wpNumber: user.wpNumber,
          profileIds: user.profileIds,
        },
      });

      return updateeUser;
    } catch (error) {
      throw new BadRequestException({
        message: 'Something went wrong while updating user',
        cause: error,
        description: error?.message,
      });
    }
  }

  async deleteUser(id: string) {
    if (!id) {
      throw new BadRequestException('id is require');
    }

    const existUser = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!existUser) {
      throw new BadRequestException('User is not found with this id');
    }

    try {
      const deleteUser = await this.prismaService.user.update({
        where: { id: id },
        data: { isDeleted: true, deletedAt: new Date() },
      });

      return deleteUser;
    } catch (error) {
      throw new BadRequestException({
        message: 'Something went wrong while deleting user',
        cause: error,
        description: error?.message,
      });
    }
  }
}
