import { Injectable } from '@nestjs/common';
// import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
// import Tracks from './entities/track.entity';
// import Users from './entities/user.entity';
// import Artists from './entities/artist.entity';
// import Albums from './entities/album.entity';
// // import FavoritesEntity from './entities/fovorites.entity';
// import FavoritesResponse from './interfaces/favoritesResponse';

@Injectable()
export class AppService {
  // public favorites: FavoritesEntity = { artists: [], albums: [], tracks: [] };
  constructor() {} // public readonly albumService: InMemoryDBService<Albums>, // public readonly artistService: InMemoryDBService<Artists>, // public readonly userService: InMemoryDBService<Users>, // public readonly trackService: InMemoryDBService<Tracks>,

  // getFavorites(): FavoritesResponse {
  //   const fav: FavoritesResponse = { artists: [], albums: [], tracks: [] };
  //   this.favorites.tracks.forEach((trackID) => {
  //     fav.tracks.push(this.trackService.get(trackID));
  //   });
  //   this.favorites.albums.forEach((albumID) => {
  //     fav.albums.push(this.albumService.get(albumID));
  //   });
  //   this.favorites.artists.forEach((artistID) => {
  //     fav.artists.push(this.artistService.get(artistID));
  //   });
  //   return fav;
  // }
}
