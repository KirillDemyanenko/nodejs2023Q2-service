import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import CreateUserDto from '../interfaces/createUserDTO';
import { JwtService } from '@nestjs/jwt';
import Users from '../entities/user.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppService } from "../app.service";

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    @InjectDataSource('database')
    private dataSource: DataSource,
    private configService: ConfigService,
    private appService: AppService
  ) {}
  @HttpCode(201)
  @Post('/signup')
  async signUp(@Body() user: CreateUserDto) {
    if (
      !user.password ||
      !user.login ||
      typeof user.login !== 'string' ||
      typeof user.password !== 'string'
    )
      throw new BadRequestException('DTO is invalid');
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

  @Post('/login')
  async login(@Body() user: CreateUserDto) {
    if (
      !user.password ||
      !user.login ||
      typeof user.login !== 'string' ||
      typeof user.password !== 'string'
    )
      throw new BadRequestException('DTO is invalid');
    const userDB: Users = await this.dataSource.manager.findOneBy<Users>(
      Users,
      {
        login: user.login,
      },
    );
    if (!userDB) throw new NotFoundException(`User not found!`);
    const payload = { userId: userDB.id, login: userDB.login };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  @Post('/refresh')
  async refresh(@Body() token: { refreshToken: string }): Promise<string> {
    if (!token.refreshToken || typeof token.refreshToken !== 'string')
      throw new UnauthorizedException('DTO is invalid');
    return 'Valid';
  }
}
