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
  UseGuards,
} from '@nestjs/common';
import Users from '../entities/user.entity';
import CreateUserDto from '../interfaces/createUserDTO';
import { isUUID } from 'class-validator';
import UpdatePasswordDto from '../interfaces/updatePasswordDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppService } from '../app.service';
import { AuthGuard } from '../auth/auth.guard';
import { LibraryLogger } from '../logger/logger';

@Controller('user')
export class UserController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
    private appService: AppService,
    private readonly logger: LibraryLogger,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUsers(): Promise<Users[]> {
    return await this.dataSource.manager.find(Users);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Users> {
    if (!isUUID(id, 4)) {
      this.logger.error(`Request to - ${request.url} - Invalid user id`);
      throw new BadRequestException('Invalid user id');
    }
    const user = await this.dataSource.manager.findOneBy<Users>(Users, {
      id: id,
    });
    if (!user) {
      this.logger.error(
        `Request to - ${request.url} - User with id - ${id} not found!`,
      );
      throw new NotFoundException(`User with id - ${id} not found!`);
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Post()
  async addUser(
    @Body() user: CreateUserDto,
    @Req() request: Request,
  ): Promise<Partial<Users>> {
    if (!user.password || !user.login) {
      this.logger.error(
        `Request to - ${request.url} - Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }
    if (
      await this.dataSource.manager.findOneBy<Users>(Users, {
        login: user.login,
      })
    )
      throw new BadRequestException(
        'A user with this name is already registered in the system',
      );
    const newUser: Users = new Users();
    newUser.password = await this.appService.hashPassword(user.password);
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

  @UseGuards(AuthGuard)
  @Put(':id')
  async editUser(
    @Param('id') id: string,
    @Body() passwords: UpdatePasswordDto,
    @Req() request: Request,
  ): Promise<Partial<Users>> {
    if (!isUUID(id, 4)) {
      this.logger.error(`Request to - ${request.url} - Invalid user id`);
      throw new BadRequestException('Invalid user id');
    }
    if (!passwords.newPassword || !passwords.oldPassword) {
      this.logger.error(
        `Request to - ${request.url} - Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }
    const user: Users = await this.dataSource.manager.findOneBy<Users>(Users, {
      id: id,
    });
    if (!user) {
      this.logger.error(
        `Request to - ${request.url} - User with id - ${id} not found!`,
      );
      throw new NotFoundException(`User with id - ${id} not found!`);
    }
    if (!(await this.appService.isMatch(passwords.oldPassword, user.password)))
      throw new ForbiddenException(`Wrong old password!`);
    user.password = await this.appService.hashPassword(passwords.newPassword);
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

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() request: Request) {
    if (!isUUID(id, 4)) {
      this.logger.error(`Request to - ${request.url} - Invalid user id`);
      throw new BadRequestException('Invalid user id');
    }
    const userForDelete = await this.dataSource.manager.findOneBy(Users, {
      id: id,
    });
    if (!userForDelete) {
      this.logger.error(
        `Request to - ${request.url} - User with id - ${id} not found!`,
      );
      throw new NotFoundException(`User with id - ${id} not found!`);
    }
    this.logger.log(
      `User - ${JSON.stringify(userForDelete)} successfully deleted!`,
    );
    return await this.dataSource.manager.delete(Users, { id: id });
  }
}
