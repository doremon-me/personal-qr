import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { UserSerializer } from './user.serializer';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() body: CreateUserDto) {
    const newUser = await this.userService.createUser(body);

    return plainToInstance(UserSerializer, newUser, {
      excludeExtraneousValues: true,
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return plainToInstance(UserSerializer, users, {
      excludeExtraneousValues: true,
    });
  }
}
