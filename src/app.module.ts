import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackController } from './track/track.controller';
import { UserController } from './user/user.controller';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

@Module({
  controllers: [AppController, UserController, TrackController],
  providers: [AppService, InMemoryDBService],
})
export class AppModule {}
