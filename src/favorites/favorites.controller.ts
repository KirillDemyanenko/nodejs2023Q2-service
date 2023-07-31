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
import TrackEntity from '../entities/track.entity';
import ArtistEntity from '../entities/artist.entity';
import AlbumEntity from '../entities/album.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: AppService) {}

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrackToFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track: TrackEntity = this.favoritesService.trackService.get(id);
    if (!track)
      throw new UnprocessableEntityException(
        `Track with id - ${id} not found!`,
      );
    this.favoritesService.favorites.tracks.push(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtistToFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artist: ArtistEntity = this.favoritesService.artistService.get(id);
    if (!artist)
      throw new UnprocessableEntityException(
        `Artist with id - ${id} not found!`,
      );
    this.favoritesService.favorites.artists.push(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbumToFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album: AlbumEntity = this.favoritesService.albumService.get(id);
    if (!album)
      throw new UnprocessableEntityException(
        `Album with id - ${id} not found!`,
      );
    this.favoritesService.favorites.albums.push(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrackFromFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    if (!this.favoritesService.favorites.tracks.includes(id))
      throw new NotFoundException(`Track with id - ${id} not found!`);
    const inx = this.favoritesService.favorites.tracks.indexOf(id);
    this.favoritesService.favorites.tracks.splice(inx, 1);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtistFromFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    if (!this.favoritesService.favorites.artists.includes(id))
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    const inx = this.favoritesService.favorites.artists.indexOf(id);
    this.favoritesService.favorites.artists.splice(inx, 1);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    if (!this.favoritesService.favorites.albums.includes(id))
      throw new NotFoundException(`Album with id - ${id} not found!`);
    const inx = this.favoritesService.favorites.albums.indexOf(id);
    this.favoritesService.favorites.albums.splice(inx, 1);
  }
}
