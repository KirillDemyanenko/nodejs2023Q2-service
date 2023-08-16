import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import CreateUserDto from '../../interfaces/createUserDTO';

@Controller('auth')
export class AuthController {
  @HttpCode(201)
  @Post('/signup')
  async addNewUser(@Body() user: CreateUserDto): Promise<string> {
    if (
      !user.password ||
      !user.login ||
      typeof user.login !== 'string' ||
      typeof user.password !== 'string'
    )
      throw new BadRequestException('DTO is invalid');
    return 'Valid'
  }
}
