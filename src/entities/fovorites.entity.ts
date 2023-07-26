import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export default interface FavoritesEntity extends InMemoryDBEntity {
  artists: string[];
  albums: string[];
  tracks: string[];
}
