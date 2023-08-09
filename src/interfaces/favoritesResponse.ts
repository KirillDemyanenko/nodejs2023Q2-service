import Artists from '../entities/artist.entity';
import Albums from '../entities/album.entity';
import Tracks from '../entities/track.entity';

export default interface FavoritesResponse {
  artists: Artists[];
  albums: Albums[];
  tracks: Tracks[];
}
