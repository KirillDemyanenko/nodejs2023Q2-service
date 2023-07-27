import { Injectable } from '@nestjs/common';
import FavoritesEntity from '../entities/fovorites.entity';

@Injectable()
export class FavoritesService {
  private favorites: FavoritesEntity[] = [
    { albums: [], artists: [], tracks: [] },
  ];

  getAll() {
    return this.favorites;
  }
}

// private readonly artistService: InMemoryDBService<ArtistEntity>,
//   private readonly albumService: InMemoryDBService<AlbumEntity>,
//   private readonly trackService: InMemoryDBService<TrackEntity>,
