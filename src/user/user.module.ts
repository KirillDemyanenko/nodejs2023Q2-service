import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

@Module({
  controllers: [UserController],
  providers: [InMemoryDBService],
})
export class UserModule {}
