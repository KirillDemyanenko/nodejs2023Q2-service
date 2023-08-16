import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import CreateUserDto from '../../interfaces/createUserDTO';

@Controller('auth')
export class AuthController {
  @HttpCode(201)
  @Post('/signup')
  async signUp(@Body() user: CreateUserDto): Promise<string> {
    if (
      !user.password ||
      !user.login ||
      typeof user.login !== 'string' ||
      typeof user.password !== 'string'
    )
      throw new BadRequestException('DTO is invalid');
    return 'Valid'
  }

  @Post('/login')
  async login(@Body() user: CreateUserDto): Promise<string> {
    if (
      !user.password ||
      !user.login ||
      typeof user.login !== 'string' ||
      typeof user.password !== 'string'
    )
      throw new BadRequestException('DTO is invalid');
    return 'Valid'
  }

  @Post('/refresh')
  async refresh(@Body() token: {refreshToken: string}): Promise<string> {
    if (
      !token.refreshToken || typeof token.refreshToken !== "string"
    )
      throw new UnauthorizedException('DTO is invalid');
    return 'Valid'
  }
}
