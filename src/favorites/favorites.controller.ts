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
    const artist = await this.dataSource
      .getRepository(FavoritesArtists)
      .createQueryBuilder('artists')
      .select('artists.artistID')
      .getMany();
    const album = await this.dataSource
      .getRepository(FavoritesAlbums)
      .createQueryBuilder('albums')
      .select('albums.albumID')
      .getMany();
    const track = await this.dataSource
      .getRepository(FavoritesTracks)
      .createQueryBuilder('tracks')
      .select('tracks.trackID')
      .getMany();
    const favorites = {
      artists: [],
      albums: [],
      tracks: [],
    };
    for (const tr of track) {
      if (tr.trackID) {
        favorites.tracks.push(
          await this.dataSource.manager.findOneBy(Tracks, { id: tr.trackID }),
        );
      }
    }
    for (const ar of artist) {
      if (ar.artistID) {
        favorites.artists.push(
          await this.dataSource.manager.findOneBy(Artists, { id: ar.artistID }),
        );
      }
    }
    for (const al of album) {
      if (al.albumID) {
        favorites.albums.push(
          await this.dataSource.manager.findOneBy(Albums, { id: al.albumID }),
        );
      }
    }
    favorites.albums = favorites.albums.filter((value) => !!value);
    favorites.artists = favorites.artists.filter((value) => !!value);
    favorites.tracks = favorites.tracks.filter((value) => !!value);
    return favorites;
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
    return await this.dataSource.manager.delete(FavoritesTracks, track);
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
    return await this.dataSource.manager.delete(FavoritesArtists, artist);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album = await this.dataSource.manager.findOneBy(FavoritesAlbums, {
      albumID: id,
    });
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    return await this.dataSource.manager.delete(FavoritesAlbums, album);
  }
}
