import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(
      +this.configService.get<number>('CRYPT_SALT'),
    );
    return await bcrypt.hash(password, salt);
  }

  async isMatch(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}
