import {
  BadGatewayException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { UserSerializer } from './user.serializer';
import { SearchAndPaginationDto } from 'src/common/dtos/searchAndPage.dto';
import { updateUserDto } from './updateUser.dto';

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

  @Put()
  async updateUser(@Body() body: updateUserDto, @Query('id') id: string) {
    const updateUser = await this.userService.updateUser(body, id);

    return plainToInstance(UserSerializer, updateUser, {
      excludeExtraneousValues: false,
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() quary: SearchAndPaginationDto) {
    const users = await this.userService.findAll(quary);

    return plainToInstance(UserSerializer, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/search')
  async findUser(@Query('search') search: string) {
    return await this.userService.findUser({
      id: search,
      email: search,
      phone: search,
    });
  }

  @Delete()
  async deleteUser(@Query('id') id: string) {
    const users = await this.userService.deleteUser(id);

    return plainToInstance(UserSerializer, users, {
      excludeExtraneousValues: true,
    });
  }
}
