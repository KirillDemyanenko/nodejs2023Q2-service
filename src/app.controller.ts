import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import UserEntity from './entities/user.entity';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userService: InMemoryDBService<UserEntity>,
  ) {}

  @Get('/user')
  getUsers() {
    return this.userService.getAll();
  }

  @Get('/user/:id')
  GetUserById(@Param('id') id: string) {
    return this.userService.query((data) => data.id === id);
  }

  @Post('/user')
  addUser(@Body() user: UserEntity): UserEntity {
    return this.userService.create(user);
  }

  @Put('/user')
  EditUser(@Body() user: UserEntity) {
    return this.userService.update(user);
  }

  @Delete('/user/:id')
  DeleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
