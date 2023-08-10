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
import Users from '../entities/user.entity';
import CreateUserDto from '../interfaces/createUserDTO';
import { isUUID } from 'class-validator';
import UpdatePasswordDto from '../interfaces/updatePasswordDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @Get()
  async getUsers(): Promise<Users[]> {
    return await this.dataSource.manager.find(Users);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Users> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    const user = await this.dataSource.manager.findOneBy(Users, { id: id });
    if (!user) throw new NotFoundException(`User with id - ${id} not found!`);
    return user;
  }

  @Post()
  async addUser(@Body() user: CreateUserDto): Promise<Partial<Users>> {
    if (!user.password || !user.login)
      throw new BadRequestException('Body does not contain required fields');
    const newUser: Users = new Users();
    newUser.password = user.password;
    newUser.login = user.login;
    newUser.createdAt = Date.now();
    newUser.version = 1;
    newUser.updatedAt = Date.now();
    const usersEntity = this.dataSource.manager.create(Users, newUser);
    await this.dataSource.manager.save(usersEntity);
    return {
      id: usersEntity.id,
      login: usersEntity.login,
      version: usersEntity.version,
      createdAt: usersEntity.createdAt,
      updatedAt: usersEntity.updatedAt,
    };
  }

  @Put(':id')
  async editUser(
    @Param('id') id: string,
    @Body() passwords: UpdatePasswordDto,
  ): Promise<Users> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    if (!passwords.newPassword || !passwords.oldPassword)
      throw new BadRequestException('Body does not contain required fields');
    const user: Users = await this.dataSource.manager.findOneBy(Users, {
      id: id,
    });
    if (!user) throw new NotFoundException(`User with id - ${id} not found!`);
    if (user.password !== passwords.oldPassword)
      throw new ForbiddenException(`Wrong old password!`);
    user.password = passwords.newPassword;
    user.version = user.version + 1;
    user.updatedAt = Date.now();
    await this.dataSource.manager.save(Users, user);
    return user;
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    const userForDelete = await this.dataSource.manager.findOneBy(Users, {
      id: id,
    });
    if (!userForDelete)
      throw new NotFoundException(`User with id - ${id} not found!`);
    return await this.dataSource.manager.delete(Users, { id: id });
  }
}
