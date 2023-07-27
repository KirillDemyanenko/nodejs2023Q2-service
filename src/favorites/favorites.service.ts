import { Injectable } from '@nestjs/common';
import FavoritesEntity from '../entities/fovorites.entity';
import TrackEntity from '../entities/track.entity';
import AlbumEntity from '../entities/album.entity';
import ArtistEntity from '../entities/artist.entity';
import FavoritesResponse from '../interfaces/favoritesResponse';

@Injectable()
export class FavoritesService {
  private favorites: FavoritesResponse = {
    albums: [],
    artists: [],
    tracks: [],
  };
  private favoritesBD: FavoritesEntity = {
    albums: [],
    artists: [],
    tracks: [],
  };

  getAll(): FavoritesResponse {
    return this.favorites;
  }

  addTrack(track: TrackEntity) {
    this.favoritesBD.tracks.push(track.id);
    this.favorites.tracks.push(track);
  }

  addAlbum(album: AlbumEntity) {
    this.favoritesBD.albums.push(album.id);
    this.favorites.albums.push(album);
  }

  addArtist(artist: ArtistEntity) {
    this.favoritesBD.artists.push(artist.id);
    this.favorites.artists.push(artist);
  }
}
