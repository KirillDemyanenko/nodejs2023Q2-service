import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import CreateUserDto from '../interfaces/createUserDTO';
import { isUUID } from 'class-validator';
import UpdatePasswordDto from '../interfaces/updatePasswordDto';
import { AppService } from '../app.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers(): UserEntity[] {
    return this.appService.userService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): UserEntity[] {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    if (!this.appService.userService.get(id))
      throw new NotFoundException(`User with id - ${id} not found!`);
    return this.appService.userService.query((data) => data.id === id);
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
    return this.appService.userService.create(newUser);
  }

  @Put(':id')
  editUser(@Param('id') id: string, @Body() passwords: UpdatePasswordDto) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    const user: UserEntity = this.appService.userService.get(id);
    if (!user) throw new NotFoundException(`User with id - ${id} not found!`);
    if (user.password !== passwords.oldPassword)
      throw new ForbiddenException(`Wrong old password!`);
    user.password = passwords.newPassword;
    return this.appService.userService.update(user);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id') id: string): void {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    if (!this.appService.userService.get(id))
      throw new NotFoundException(`User with id - ${id} not found!`);
    return this.appService.userService.delete(id);
  }
}
