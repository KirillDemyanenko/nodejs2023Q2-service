import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AppService } from '../app.service';
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
  async getFavorites() {
    return {
      artists: await this.dataSource.manager.find(FavoritesArtists),
      albums: await this.dataSource.manager.find(FavoritesAlbums),
      tracks: await this.dataSource.manager.find(FavoritesTracks),
    };
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrackToFavorites(@Param('id') id: string) {
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
  async addArtistToFavorites(@Param('id') id: string) {
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
  async addAlbumToFavorites(@Param('id') id: string) {
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
  async deleteTrackFromFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track = await this.dataSource.manager.findOneBy(FavoritesTracks, {
      trackID: id,
    });
    if (!track) throw new NotFoundException(`Track with id - ${id} not found!`);
    await this.dataSource.manager.delete(FavoritesTracks, { trackID: id });
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtistFromFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artist = await this.dataSource.manager.findOneBy(FavoritesArtists, {
      artistID: id,
    });
    if (!artist)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    await this.dataSource.manager.delete(FavoritesArtists, { artistID: id });
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album = await this.dataSource.manager.findOneBy(FavoritesAlbums, {
      albumID: id,
    });
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    await this.dataSource.manager.delete(FavoritesArtists, { albumID: id });
  }
}
