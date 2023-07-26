import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import CreateUserDto from '../interfaces/createUserDTO';
import { isUUID } from 'class-validator';
import UpdatePasswordDto from '../interfaces/updatePasswordDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: InMemoryDBService<UserEntity>) {}

  @Get()
  getUsers() {
    return this.userService.getAll();
  }

  @Get('/:id')
  GetUserById(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    if (!this.userService.get(id))
      throw new NotFoundException(`User with id - ${id} not found!`);
    return this.userService.query((data) => data.id === id);
  }

  @Post()
  addUser(@Body() user: CreateUserDto): UserEntity {
    if (!user.password || !user.login)
      throw new BadRequestException('Body does not contain required fields');
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

  @Put('/:id')
  EditUser(@Param('id') id: string, @Body() passwords: UpdatePasswordDto) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    const user: UserEntity = this.userService.get(id);
    if (!user) throw new NotFoundException(`User with id - ${id} not found!`);
    if (user.password !== passwords.oldPassword)
      throw new ForbiddenException(`Wrong old password!`);
    user.password = passwords.newPassword;
    return this.userService.update(user);
  }

  @Delete(':id')
  DeleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
