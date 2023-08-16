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
  Req,
  UnauthorizedException,
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
  async getUsers(@Req() req: Request): Promise<Users[]> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    return await this.dataSource.manager.find(Users);
  }

  @Get(':id')
  async getUserById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Users> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    const user = await this.dataSource.manager.findOneBy(Users, { id: id });
    if (!user) throw new NotFoundException(`User with id - ${id} not found!`);
    return user;
  }

  @Post()
  async addUser(
    @Req() req: Request,
    @Body() user: CreateUserDto,
  ): Promise<Partial<Users>> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
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
    @Req() req: Request,
    @Body() passwords: UpdatePasswordDto,
  ): Promise<Partial<Users>> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
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
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: parseInt(user.createdAt.toString(), 10),
      updatedAt: user.updatedAt,
    };
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Req() req: Request, @Param('id') id: string) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid user id');
    const userForDelete = await this.dataSource.manager.findOneBy(Users, {
      id: id,
    });
    if (!userForDelete)
      throw new NotFoundException(`User with id - ${id} not found!`);
    return await this.dataSource.manager.delete(Users, { id: id });
  }
}
