import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackController } from './track/track.controller';
import { UserController } from './user/user.controller';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ArtistController } from './artist/artist.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlbumController } from './album/album.controller';
import { FavoritesController } from './favorites/favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Albums from './entities/album.entity';
import Artists from './entities/artist.entity';
import Users from './entities/user.entity';
import Tracks from './entities/track.entity';
import {
  FavoritesAlbums,
  FavoritesArtists,
  FavoritesTracks,
} from './entities/fovorites.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'database',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          Albums,
          Artists,
          Tracks,
          Users,
          FavoritesAlbums,
          FavoritesArtists,
          FavoritesTracks,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    UserController,
    TrackController,
    ArtistController,
    AlbumController,
    FavoritesController,
  ],
  exports: [AppService],
  providers: [AppService, InMemoryDBService],
})
export class AppModule {}
