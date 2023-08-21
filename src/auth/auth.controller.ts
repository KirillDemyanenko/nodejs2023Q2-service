import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import CreateUserDto from '../interfaces/createUserDTO';
import { JwtService } from '@nestjs/jwt';
import Users from '../entities/user.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppService } from '../app.service';
import { LibraryLogger } from '../logger/logger';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    @InjectDataSource('database')
    private dataSource: DataSource,
    private configService: ConfigService,
    private appService: AppService,
    private readonly logger: LibraryLogger,
  ) {}
  @HttpCode(201)
  @Post('/signup')
  async signUp(@Body() user: CreateUserDto, @Req() request: Request) {
    this.logger.verbose(
      `Request to - ${
        request.url
      } without query params and with body - ${JSON.stringify(request.body)}.`,
    );
    if (
      !user.password ||
      !user.login ||
      typeof user.login !== 'string' ||
      typeof user.password !== 'string'
    ) {
      this.logger.error(`Request to - ${request.url} - DTO is invalid`);
      throw new BadRequestException('DTO is invalid');
    }
    if (
      await this.dataSource.manager.findOneBy<Users>(Users, {
        login: user.login,
      })
    ) {
      this.logger.error(
        `Request to - ${request.url} - A user with ${user.login} name is already registered in the system`,
      );
      throw new BadRequestException(
        'A user with this name is already registered in the system',
      );
    }
    const newUser: Users = new Users();
    newUser.password = await this.appService.hashPassword(user.password);
    newUser.login = user.login;
    newUser.createdAt = Date.now();
    newUser.version = 1;
    newUser.updatedAt = Date.now();
    const usersEntity = this.dataSource.manager.create(Users, newUser);
    await this.dataSource.manager.save(usersEntity);
    this.logger.log(
      `Request to - ${request.url} user ${JSON.stringify(
        usersEntity,
      )}.successfully sign in`,
    );
    return {
      id: usersEntity.id,
      login: usersEntity.login,
      version: usersEntity.version,
      createdAt: usersEntity.createdAt,
      updatedAt: usersEntity.updatedAt,
    };
  }

  @Post('/login')
  async login(@Body() user: CreateUserDto, @Req() request: Request) {
    this.logger.verbose(
      `Request to - ${
        request.url
      } without query params and with body - ${JSON.stringify(request.body)}.`,
    );
    if (
      !user.password ||
      !user.login ||
      typeof user.login !== 'string' ||
      typeof user.password !== 'string'
    ) {
      this.logger.error(`Request to - ${request.url} - DTO is invalid`);
      throw new BadRequestException('DTO is invalid');
    }
    const userDB: Users = await this.dataSource.manager.findOneBy<Users>(
      Users,
      {
        login: user.login,
      },
    );
    if (!userDB) {
      this.logger.error(`Request to - ${request.url} - User not found!`);
      throw new NotFoundException(`User not found!`);
    }
    const payload = { userId: userDB.id, login: userDB.login };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    userDB.accessToken = accessToken;
    userDB.refreshToken = refreshToken;
    await this.dataSource.manager.save(Users, userDB);
    this.logger.log(
      `Request to - ${request.url} user ${JSON.stringify(
        userDB.login,
      )}.successfully login`,
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  @Post('/refresh')
  async refresh(
    @Body() token: { refreshToken: string },
    @Req() request: Request,
  ) {
    this.logger.verbose(
      `Request to - ${
        request.url
      } without query params and with body - ${JSON.stringify(request.body)}.`,
    );
    if (!token.refreshToken || typeof token.refreshToken !== 'string') {
      this.logger.error(`Request to - ${request.url} - DTO is invalid`);
      throw new UnauthorizedException('DTO is invalid');
    }
    const userDB: Users = await this.dataSource.manager.findOneBy<Users>(
      Users,
      {
        refreshToken: token.refreshToken,
      },
    );
    if (!userDB) {
      this.logger.error(`Request to - ${request.url} - User not found!`);
      throw new NotFoundException(`User not found!`);
    }
    const payload = { userId: userDB.id, login: userDB.login };
    const accessTokenNew = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
    const refreshTokenNew = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    userDB.accessToken = accessTokenNew;
    userDB.refreshToken = refreshTokenNew;
    await this.dataSource.manager.save(Users, userDB);
    this.logger.log(
      `Request to - ${request.url} user ${userDB.login}.successfully refresh token`,
    );
    return { accessToken: accessTokenNew, refreshToken: refreshTokenNew };
  }
}
