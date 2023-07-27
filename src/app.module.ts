import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackController } from './track/track.controller';
import { UserController } from './user/user.controller';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ArtistController } from './artist/artist.controller';
import { ConfigModule } from '@nestjs/config';
import { AlbumController } from './album/album.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    UserController,
    TrackController,
    ArtistController,
    AlbumController,
  ],
  providers: [AppService, InMemoryDBService],
})
export class AppModule {}
