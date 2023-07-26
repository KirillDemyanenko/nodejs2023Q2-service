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

@Controller('user')
export class UserController {
  constructor(private userService: InMemoryDBService<UserEntity>) {}

  @Get()
  getUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  GetUserById(@Param('id') id: string) {
    return this.userService.query((data) => data.id === id);
  }

  @Post()
  addUser(@Body() user: UserEntity): UserEntity {
    return this.userService.create(user);
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
