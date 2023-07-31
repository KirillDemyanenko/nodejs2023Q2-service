import ArtistEntity from '../entities/artist.entity';
import AlbumEntity from '../entities/album.entity';
import TrackEntity from '../entities/track.entity';

export default interface FavoritesResponse {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}
