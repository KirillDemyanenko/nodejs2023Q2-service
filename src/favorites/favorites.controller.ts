import { Controller, Get } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import TrackEntity from '../entities/track.entity';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import AlbumEntity from '../entities/album.entity';
import ArtistEntity from '../entities/artist.entity';
import FavoritesResponse from '../interfaces/favoritesResponse';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly artistService: InMemoryDBService<ArtistEntity>,
    private readonly albumService: InMemoryDBService<AlbumEntity>,
    private readonly trackService: InMemoryDBService<TrackEntity>,
  ) {}

  @Get()
  getArtists(): FavoritesResponse {
    return this.favoritesService.getAll();
  }
}
