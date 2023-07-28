import { Injectable } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import TrackEntity from './entities/track.entity';
import UserEntity from './entities/user.entity';
import ArtistEntity from './entities/artist.entity';
import AlbumEntity from './entities/album.entity';
import FavoritesEntity from './entities/fovorites.entity';
import FavoritesResponse from './interfaces/favoritesResponse';

@Injectable()
export class AppService {
  private favorites: FavoritesEntity = { artists: [], albums: [], tracks: [] };
  constructor(
    public readonly trackService: InMemoryDBService<TrackEntity>,
    public readonly userService: InMemoryDBService<UserEntity>,
    public readonly artistService: InMemoryDBService<ArtistEntity>,
    public readonly albumService: InMemoryDBService<AlbumEntity>,
  ) {}

  getFavorites() {
    const fav: FavoritesResponse = { artists: [], albums: [], tracks: [] };
    this.favorites.tracks.forEach((trackID) => {
      fav.tracks.push(this.trackService.get(trackID));
    });
    this.favorites.albums.forEach((albumID) => {
      fav.albums.push(this.albumService.get(albumID));
    });
    this.favorites.artists.forEach((artistID) => {
      fav.artists.push(this.artistService.get(artistID));
    });
    return fav;
  }
}
