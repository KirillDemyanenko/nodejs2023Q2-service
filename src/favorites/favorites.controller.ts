import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import Tracks from '../entities/track.entity';
import Artists from '../entities/artist.entity';
import Albums from '../entities/album.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  FavoritesAlbums,
  FavoritesArtists,
  FavoritesTracks,
} from '../entities/fovorites.entity';

@Controller('favs')
export class FavoritesController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @Get()
  async getFavorites(@Req() req: Request) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    return {
      artists: await this.dataSource.query(`
        select "public".artists."id", "name", "grammy"
        from "public".favorites_artists left join "public".artists
        on "public".favorites_artists."artistID" = "public".artists."id"
    `),
      albums: await this.dataSource.query(`
        select "public".albums."id", "name", "year", "artistId"
        from "public".favorites_albums left join "public".albums
        on "public".favorites_albums."albumID" = "public".albums."id"
    `),
      tracks: await this.dataSource.query(`
        select "public".tracks."id", "name", "artistId", "duration", "albumId"
        from "public".favorites_tracks left join "public".tracks
        on "public".favorites_tracks."trackID" = "public".tracks."id"
    `),
    };
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrackToFavorites(@Req() req: Request, @Param('id') id: string) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track = await this.dataSource.manager.findOneBy(Tracks, { id: id });
    if (!track)
      throw new UnprocessableEntityException(
        `Track with id - ${id} not found!`,
      );
    const newFavoritesTrack = new FavoritesTracks();
    newFavoritesTrack.trackID = id;
    const tracksEntity = this.dataSource.manager.create(
      FavoritesTracks,
      newFavoritesTrack,
    );
    await this.dataSource.manager.save(tracksEntity);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtistToFavorites(@Req() req: Request, @Param('id') id: string) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artist: Artists = await this.dataSource.manager.findOneBy(Artists, {
      id: id,
    });
    if (!artist)
      throw new UnprocessableEntityException(
        `Artist with id - ${id} not found!`,
      );
    const newFavoritesArtist = new FavoritesArtists();
    newFavoritesArtist.artistID = id;
    const artistsEntity = this.dataSource.manager.create(
      FavoritesArtists,
      newFavoritesArtist,
    );
    await this.dataSource.manager.save(artistsEntity);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbumToFavorites(@Req() req: Request, @Param('id') id: string) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album: Albums = await this.dataSource.manager.findOneBy(Albums, {
      id: id,
    });
    if (!album)
      throw new UnprocessableEntityException(
        `Album with id - ${id} not found!`,
      );
    const newFavoritesAlbum = new FavoritesAlbums();
    newFavoritesAlbum.albumID = id;
    const albumEntity = this.dataSource.manager.create(
      FavoritesAlbums,
      newFavoritesAlbum,
    );
    await this.dataSource.manager.save(albumEntity);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrackFromFavorites(@Req() req: Request, @Param('id') id: string) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track = await this.dataSource.manager.findOneBy(FavoritesTracks, {
      trackID: id,
    });
    if (!track) throw new NotFoundException(`Track with id - ${id} not found!`);
    return await this.dataSource.manager.delete(FavoritesTracks, track);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtistFromFavorites(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artist = await this.dataSource.manager.findOneBy(FavoritesArtists, {
      artistID: id,
    });
    if (!artist)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    return await this.dataSource.manager.delete(FavoritesArtists, artist);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbumFromFavorites(@Req() req: Request, @Param('id') id: string) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album = await this.dataSource.manager.findOneBy(FavoritesAlbums, {
      albumID: id,
    });
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    return await this.dataSource.manager.delete(FavoritesAlbums, album);
  }
}
