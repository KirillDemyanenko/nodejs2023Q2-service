import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackController } from './track/track.controller';
import { UserController } from './user/user.controller';
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
import { AuthController } from './auth/auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'database',
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: await configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: await configService.get('DB_USERNAME'),
        password: await configService.get('DB_PASSWORD'),
        database: await configService.get('DB_NAME'),
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
    AuthController,
  ],
  exports: [AppService],
  providers: [AppService],
})
export class AppModule {}
