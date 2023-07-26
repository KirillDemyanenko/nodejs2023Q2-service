import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { CreateUserDto } from '../interfaces/createUserDTO';

@Controller('user')
export class UserController {
  constructor(private readonly userService: InMemoryDBService<UserEntity>) {}

  @Get()
  getUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  GetUserById(@Param('id') id: string) {
    return this.userService.query((data) => data.id === id);
  }

  @Post()
  addUser(@Body() user: CreateUserDto): UserEntity {
    const newUser: UserEntity = {
      id: '',
      password: user.password,
      login: user.login,
      createdAt: Date.now(),
      version: 1,
      updatedAt: Date.now(),
    };
    return this.userService.create(newUser);
  }

  @Put()
  EditUser(@Body() user: UserEntity) {
    return this.userService.update(user);
  }

  @Delete(':id')
  DeleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
